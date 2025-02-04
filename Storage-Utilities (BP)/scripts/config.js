import {SaplingExtension, ConfigBuilder} from 'lib/sapling'

const extension = new SaplingExtension({
    extensionId: 'storage-utilities',
    extensionName: 'Storage Utilities',
    extensionNamespace: 'storageutilities'
});

const Debug = new ConfigBuilder()
.setDebugMode(false)
.setAutomaticTranslations(true);

export {extension, Debug}