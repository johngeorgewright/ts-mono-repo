import { MustacheGenerator } from '../generator/MustacheGenerator.js'
import { GeneratorCommand } from 'clipanion-generator-command/GeneratorCommand'

export abstract class MustacheGeneratorCommand extends GeneratorCommand {
  get generator() {
    return new MustacheGenerator(this.templateDir, this.destinationDir)
  }
}
