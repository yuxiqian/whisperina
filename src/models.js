const {preferences} = iina;

const MODELS = [{
    name: 'tiny', size: '75 MiB', sha: 'bd577a113a864445d4c299885e0cb97d4ba92b5f'
}, {
    name: 'tiny.en', size: '75 MiB', sha: 'c78c86eb1a8faa21b369bcd33207cc90d64ae9df'
}, {
    name: 'base', size: '142 MiB', sha: '465707469ff3a37a2b9b8d8f89f2f99de7299dac'
}, {
    name: 'base.en', size: '142 MiB', sha: '137c40403d78fd54d454da0f9bd998f78703390c'
}, {
    name: 'small', size: '466 MiB', sha: '55356645c2b361a969dfd0ef2c5a50d530afd8d5'
}, {
    name: 'small.en', size: '466 MiB', sha: 'db8a495a91d927739e50b3fc1cc4c6b8f6c2d022'
}, {
    name: 'small.en-tdrz', size: '465 MiB', sha: 'b6c6e7e89af1a35c08e6de56b66ca6a02a2fdfa1'
}, {
    name: 'medium', size: '1.5 GiB', sha: 'fd9727b6e1217c2f614f9b698455c4ffd82463b4'
}, {
    name: 'medium.en', size: '1.5 GiB', sha: '8c30f0e44ce9560643ebd10bbe50cd20eafd3723'
}, {
    name: 'large-v1', size: '2.9 GiB', sha: 'b1caaf735c4cc1429223d5a74f0f4d0b9b59a299'
}, {
    name: 'large-v2', size: '2.9 GiB', sha: '0f4c8e34f21cf1a914c59d8b3ce882345ad349d6'
}, {
    name: 'large-v2-q5_0', size: '1.1 GiB', sha: '00e39f2196344e901b3a2bd5814807a769bd1630'
}, {
    name: 'large-v3', size: '2.9 GiB', sha: 'ad82bf6a9043ceed055076d0fd39f5f186ff8062'
}, {
    name: 'large-v3-q5_0', size: '1.1 GiB', sha: 'e6e2ed78495d403bef4b7cff42ef4aaadcfea8de'
}, {
    name: 'large-v3-turbo', size: '1.5 GiB', sha: '4af2b29d7ec73d781377bfd1758ca957a807e941'
}, {
    name: 'large-v3-turbo-q5_0', size: '547 MiB', sha: 'e050f7970618a659205450ad97eb95a18d69c9ee'
}]

export const listModels = function () {
    return MODELS.filter(model => preferences.get('show_' + model.name.replaceAll(/[-.]/g, '_')))
}