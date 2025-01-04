import { readFile, writeFile } from 'node:fs/promises'
import * as prettier from 'prettier'

export async function readJSONFile<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, 'utf-8'))
}

export async function writeJSONFile<T>(path: string, data: T): Promise<void> {
  await writeFile(
    path,
    await prettier.format(JSON.stringify(data), {
      ...(await prettier.resolveConfig(path)),
      parser: 'json',
    }),
  )
}

export async function updateJSONFile<T>(path: string, update: (data: T) => T) {
  let data: T = await readJSONFile<T>(path)
  data = update(data)
  await writeJSONFile(path, data)
}
