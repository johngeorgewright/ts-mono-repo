#!/usr/bin/env node

import { runExit } from 'clipanion'
import { AddPackageCommand } from './commands/package/add/AddPackageCommand.js'
import { LinkPackageCommand } from './commands/package/link/LinkPackageCommand.js'
import { RemovePackageCommand } from './commands/package/remove/RemovePackageCommand.js'
import { UnlinkPackageCommand } from './commands/package/unlink/UnlinkPackageCommand.js'
import { Context } from './Context.js'
import { $ } from 'zx'
import { projectRootPath } from './workspace.js'

runExit<Context>(
  [
    AddPackageCommand,
    LinkPackageCommand,
    UnlinkPackageCommand,
    RemovePackageCommand,
  ],
  {
    $: $({
      cwd: projectRootPath,
      verbose: true,
    }),
  },
)
