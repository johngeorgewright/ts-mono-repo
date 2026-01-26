import { Command } from 'clipanion'
import type { Context } from '../Context.js'

export abstract class BaseCommand extends Command<Context> {}
