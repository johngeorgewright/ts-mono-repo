#!/usr/bin/env node

import { runExit } from 'clipanion'
import { AddPackageCommand } from './commands/package/add/AddPackageCommand.js'
import { RemovePackageCommand } from './commands/package/RemovePackageCommand.js'

runExit([AddPackageCommand, RemovePackageCommand])
