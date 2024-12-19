#!/usr/bin/env node

import { runExit } from 'clipanion'
import { AddPackageCommand } from './commands/package/add/AddPackageCommand.js'
import { RemovePackageCommand } from './commands/package/remove/RemovePackageCommand.js'
import { LinkPackageCommand } from './commands/package/link/LinkPackageCommand.js'

runExit([AddPackageCommand, LinkPackageCommand, RemovePackageCommand])
