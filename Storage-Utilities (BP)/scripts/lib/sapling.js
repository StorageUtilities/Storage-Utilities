import { world, system, Player } from "@minecraft/server";

const Dimension = world.getDimension("minecraft:overworld");

/**
 * Represents an extension for the Sapling framework.
 */
export class SaplingExtension {
    #loaded = false;
    #protocols = {};
    #gamerulesData = {};

    /**
     * @param {Object} options
     * @param {string} options.extensionId - The ID of the extension.
     * @param {string} options.extensionNamespace - The namespace of the extension.
     * @param {string} options.extensionName - The name of the extension.
     */
    constructor({ extensionId, extensionNamespace, extensionName }) {
        this.extensionId = extensionId;
        this.extensionNamespace = extensionNamespace;
        this.extensionName = extensionName;
        this.commands = {};
        this.gamerules = {};
        this.config = {};

        system.afterEvents.scriptEventReceive.subscribe(this.#handleProtocol.bind(this));
        system.afterEvents.scriptEventReceive.subscribe(this.#handleScriptEvent.bind(this));
    }

    /**
     * Handles incoming script events.
     * @private
     * @param {Object} event - The script event.
     */
    #handleScriptEvent(event) {
        const { id: protocol, message, sourceType } = event;
        if (sourceType !== "Server" || !protocol.startsWith(this.extensionNamespace)) return;
        
        if (this.config.debugMode) world.sendMessage(JSON.stringify(event, null, 2));

        const id = this.extensionNamespace;
        
        if (protocol.startsWith(`${id}:command.`)) {
            this.#handleCommand(protocol.replace(`${id}:command.`, ""), message);
        } else if (protocol.startsWith(`${id}:gamerules`)) {
            const data = JSON.parse(message);
            for (const k in data) this.#gamerulesData[k] = data[k];
        }
    }

    /**
     * Handles incoming protocols.
     * @private
     * @param {Object} event - The script event.
     */
    #handleProtocol(event) {
        if (this.config.debugMode) world.sendMessage(JSON.stringify(event, null, 2));
        
        const protocol = event.id;
        
        if (protocol in this.#protocols) {
            this.#protocols[protocol](event);
        }
    }

    /**
     * Handles a command.
     * @private
     * @param {string} cmd - The command name.
     * @param {string} message - The message received with the command.
     */
    #handleCommand(cmd, message) {
        const command = this.commands[cmd];
        if (!command) return;

        const { senderName, args } = JSON.parse(message);
        const sender = world.getPlayers({ name: senderName })[0];
        if (!sender) return;

        const commandData = Command.commands[`#${command.name}`];
        if (Array.isArray(args) && args.length !== commandData.args.length) {
            return sender.sendMessage("§cSyntax error");
        }

        commandData.callback(sender, args);
    }

    /**
     * Registers a script event protocol.
     *
     * @param {string} identifier - The unique identifier for the event.
     * @param {Function} callback - The function to be executed when the event is triggered.
     * @throws {Error} Throws an error if the protocol identifier is already registered.
     * @throws {Error} Throws an error if the provided callback is not a function.
     * @returns {this} Returns the current instance for method chaining.
     */
    setProtocol(identifier, callback) {
        const parseId = this.extensionNamespace + ":event_" + identifier;

        if (parseId in this.#protocols) throw new Error(`The protocol ${identifier} is already saved!`);
        else if (typeof callback !== "function") throw new Error("The callback is not a function!");

        this.#protocols[parseId] = callback;

        return this;
    }

    /**
     * Sets game rules for the extension.
     * @param {Object} gamerules - The game rules to set.
     */
    setGameRules(gamerules) {
        Object.entries(gamerules).forEach(([key, value]) => {
            if (["client", "server", "engine"].includes(value)) {
                this.gamerules[key] = value;
            }
        });
    }

    /**
     * Retrieves the value of a gamerule from the database or a player's tags.
     * 
     * @param {string} gamerule - The identifier of the gamerule to retrieve.
     * @param {boolean} [isClient=false] - Whether to check client-specific gamerules.
     * @param {Player} [player] - The player instance to check for client gamerules (required if `isClient` is true).
     * @returns {boolean} - The value of the specified gamerule.
     * 
     * @throws {Error} If the extension is not loaded.
     * @throws {Error} If the specified gamerule is invalid.
     * @throws {Error} If `isClient` is true but `player` is not a valid `Player` instance.
     */
    getGamerule(gamerule, isClient = false, player) {
        if (!this.#loaded) {
            throw new Error("The extension is not already loaded");
        }

        if (!(gamerule in this.gamerules)) {
            throw new Error("Invalid gamerule!");
        }

        if (isClient) {
            if (!(player instanceof Player)) {
                throw new Error("Invalid player instance!");
            }

            return player.hasTag("client:" + gamerule);
        } else {
            return this.#gamerulesData[gamerule];
        }
    }

    /**
     * Registers a new command.
     * @param {Command} command - The command to register.
     */
    setCommand(command) {
        this.commands[command.data.name] = command.data;
    }

    /**
     * Loads the extension.
     * @param {ConfigBuilder} config - The configuration builder.
     * @throws {Error} If the extension is already loaded.
     */
    load(config = new ConfigBuilder()) {
        if (this.#loaded) {
            throw new Error("The extension is already loaded");
        }

        if (!(config instanceof ConfigBuilder)) {
            throw new Error("Invalid configuration");
        }

        this.#loaded = true;
        this.config = config;

        if (this.config.debugMode) world.sendMessage(JSON.stringify(this, null, 2));
        Dimension.runCommand(`scriptevent sapling:extension_load ${JSON.stringify(this)}`);
    }

    /**
     * Updates the extension.
     * @throws {Error} If the extension is not already loaded.
     */
    update() {
        if (!this.#loaded) {
            throw new Error("The extension is not already loaded");
        }

        if (this.config.debugMode) world.sendMessage(JSON.stringify(this, null, 2));
        Dimension.runCommand(`scriptevent sapling:extension_load ${JSON.stringify(this)}`);
    }

    /**
     * Gets the load state of the extension.
     * @returns {boolean} Whether the extension is loaded.
     */
    getLoadState() {
        return this.#loaded;
    }
}


/**
 * Represents a debug screen for displaying content.
 */
export class DebugScreen {
    #extension;

    /**
     * @param {SaplingExtension} extension - The associated SaplingExtension instance.
     * @throws {Error} If the extension is not a SaplingExtension instance.
     */
    constructor(extension) {
        if (!(extension instanceof SaplingExtension)) {
            throw new Error("Is not a SaplingExtension instance");
        }
        
        this.#extension = extension;
    }

    /**
     * Displays content on the debug screen.
     * @param {string[]} content - The content to display.
     * @throws {Error} If the extension is not loaded.
     */
    displayContent(content) {
        if (!this.#extension.getLoadState()) {
            throw new Error("The extension is not loaded!");
        }

        const data = { id: this.#extension.extensionId, content };
        Dimension.runCommand(`scriptevent sapling:debugscreen_push ${JSON.stringify(data)}`);
    }
}


/**
 * Represents a configuration builder.
 */
export class ConfigBuilder {
    constructor() {
        this.automaticTranslations = true;
        this.debugMode = false;
        this.descriptionKeys = {}
    }

    /**
     * Enables or disables help translations.
     * @param {boolean} value - Whether to enable help translations.
     * @returns {this}
     */
    setAutomaticTranslations(value) {
        this.automaticTranslations = value;
        return this;
    }

    /**
     * Enables or disables help translations.
     * @param {boolean} value - Whether to enable help translations.
     * @returns {this}
     */
    setDebugMode(value) {
        this.debugMode = value;
        return this;
    }

    /**
     * Sets the description keys for the configuration.
     * @param {Record<`sapling.help.${command | feature}.${string}`, string>} descriptionKeys - An object where keys start with "sapling." followed by a string, and values are strings representing descriptions.
     * @returns {ConfigBuilder} The current instance of ConfigBuilder for method chaining.
     */
    setDescriptionKeys(descriptionKeys) {
        this.descriptionKeys = descriptionKeys;
        return this;
    }
}


/**
 * Represents a command for the Sapling framework.
 */
export class Command {
    static commands = {};
    static prefix = './';

    /**
     * @param {Object} [data={}] - The command data.
     */
    constructor(data = {}) {
        this.data = {
            name: "",
            description: "",
            args: [],
            extensionValidation: { checkAdmin: false, requiredGamerules: [] },
            subcommands: {},
            ...data
        };
    }


    /**
     * Builds the command and registers it.
     * @returns {this}
     */
    build() {
        const cmd = `${Command.prefix}${this.data.name}`;
        const rmd = `#${this.data.name}`;
        Command.commands[cmd] = this.data;
        Command.commands[rmd] = this.data;
        return this;
    }


    /**
     * Sets the validation options for the command.
     *
     * @param {Object} [validation] - Validation options.
     * @param {boolean} [validation.checkAdmin=false] - Specifies whether to check if the user is an admin.
     * @param {Array<string>} [validation.requiredGamerules=[]] - List of required gamerules.
     * @returns {this} - The current instance for method chaining.
     */
    setValidation(validation = { checkAdmin: false, requiredGamerules: [] }) {
        const data = validation;

        if (!("checkAdmin" in data)) data["checkAdmin"] = false;
        if (!("requiredGamerules" in data)) data["requiredGamerules"] = [];

        this.data.extensionValidation = data;
        return this;
    }


    /**
     * Sets the name of the command.
     * @param {string} name - The command name.
     * @returns {this}
     */
    setName(name) {
        this.data.name = name;
        return this;
    }

    /**
     * Sets the usage description of the command.
     * @param {string} usage - The usage description.
     * @returns {this}
     */
    setUsage(usage) {
        this.data.description = usage;
        return this;
    }

    /**
     * Sets the callback function for the command.
     * @param {Function} callback - The callback function.
     * @returns {this}
     */
    setCallback(callback) {
        this.data.callback = callback;
        return this;
    }

    /**
     * Adds an argument to the command.
     * @param {string} type - The type of the argument.
     * @param {string} name - The name of the argument.
     * @returns {this}
     */
    addArgument(type, name) {
        this.data.args.push({ type, name });
        return this;
    }
}


/**
 * A JSON-based database using dynamic properties.
 */
export class JsonDB {
    /**
     * Creates an instance of JsonDB.
     * @param {string} name - The name of the database, used as a unique identifier.
     */
    constructor(name) {
        this.name = name;
        // Create or get
        let db = world.getDynamicProperty(this.name);
        if (!db) world.setDynamicProperty(this.name, '{}');

        let s = Object.keys(db || {}).length;
        this.size = s;
    }

    /**
     * Retrieves the value associated with the given key.
     * @param {string} key - The key to retrieve the value for.
     * @returns {any} The value associated with the key, or `undefined` if the key does not exist.
     */
    get(key) {
        let db = world.getDynamicProperty(this.name);
        let json = JSON.parse(db);

        return json[key];
    }

    /**
     * Sets a key-value pair in the database.
     * @param {string} key - The key to set.
     * @param {any} value - The value to associate with the key.
     */
    set(key, value) {
        let db = world.getDynamicProperty(this.name);
        let json = JSON.parse(db);

        if (!json[key]) this.size++;
        json[key] = value;

        let str = JSON.stringify(json);
        world.setDynamicProperty(this.name, str);
    }

    /**
     * Checks if a key exists in the database.
     * @param {string} key - The key to check for existence.
     * @returns {boolean} `true` if the key exists, otherwise `false`.
     */
    has(key) {
        let db = world.getDynamicProperty(this.name);
        let json = JSON.parse(db);

        return Boolean(json[key]);
    }

    /**
     * Removes a key and its associated value from the database.
     * @param {string} key - The key to remove.
     */
    remove(key) {
        let db = world.getDynamicProperty(this.name);
        let json = JSON.parse(db);

        if (json[key]) this.size--;
        delete json[key];

        let str = JSON.stringify(json);
        world.setDynamicProperty(this.name, str);
    }

    /**
     * Iterates over each key-value pair in the database and executes a callback function.
     * @param {function(string, any): void} callback - A function to execute for each key-value pair. Receives the key and value as arguments.
     * @param {boolean} [forAwait=false] - Whether to use `for await...of` for asynchronous iteration.
     * @returns {Promise<void>} Resolves when the iteration completes.
     */
    async forEach(callback, forAwait = false) {
        let db = mc.world.getDynamicProperty(this.name);
        let json = JSON.parse(db);

        let data = Object.keys(json);
        if (forAwait) {
            for await (let key of data) callback(key, json[key]);
        } else {
            for (let key of data) callback(key, json[key]);
        }
    }

    /**
     * Parses and returns the entire database as a JSON object.
     * @returns {Object<string, any>} The parsed database object.
     */
    parse() {
        let db = world.getDynamicProperty(this.name);
        let json = JSON.parse(db);
        return json;
    }

    /**
     * Returns all the values stored in the database.
     * @returns {any[]} An array of all the values.
     */
    values() {
        let db = world.getDynamicProperty(this.name);
        let json = JSON.parse(db);

        return Object.values(json);
    }

    /**
     * Returns all the keys stored in the database.
     * @returns {string[]} An array of all the keys.
     */
    keys() {
        let db = world.getDynamicProperty(this.name);
        let json = JSON.parse(db);

        return Object.keys(json);
    }

    /**
     * Clears all data from the database.
     */
    clear() {
        world.setDynamicProperty(this.name, '{}');
    }
}


/**
 * Checks if a player has the "sapling_admin" tag.
 * @param {Player} player - The player instance.
 * @returns {boolean} Whether the player is a Sapling admin.
 */
export function CheckSaplingAdmin(player) {
    const isAdmin = player.hasTag('sapling_admin');
    return isAdmin;
}