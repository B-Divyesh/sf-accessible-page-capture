import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Accessible Page Capture',
    description: 'Record blocked web steps and export a private issue packet.',
    version: '1.0.0',
    permissions: ['storage', 'tabs', 'activeTab', 'downloads'],
    host_permissions: ['<all_urls>'],
    action: { default_title: 'Open Accessible Page Capture' },
    commands: {
      '_execute_action': {
        suggested_key: { default: 'Alt+Shift+A', mac: 'MacCtrl+Shift+A' }
      }
    }
  }
});
