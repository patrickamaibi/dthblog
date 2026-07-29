/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '7vf8xmbe',
    dataset: 'production',
  },
  deployment: {
    appId: 'tm9bc0jvwgbyt7n4adlzu866',
    autoUpdates: true
  }
})