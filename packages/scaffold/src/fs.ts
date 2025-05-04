import * as prettier from 'prettier'

export async function readJSONFile<T>(path: string): Promise<T> {
  return JSON.parse(await Bun.file(path).text())
}

export async function writeJSONFile<T>(path: string, data: T): Promise<void> {
  await Bun.write(
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
