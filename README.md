# Exec
![Tests](https://github.com/simplyhexagonal/exec/workflows/tests/badge.svg)

A convenient async wrapper for Node.js's `child_process.exec` function.

```ts
import exec from '@simplyhexagonal/exec';

const successResult = await exec('echo hello world');

// successResult {
//   "exitCode": 0,
//   "stdoutOutput": "hello world\n",
//   "stderrOutput": ""
// }

const failResult = await exec(
  '>&2 echo hello world && exit 1'
).catch((e) => e);

// failResult {
//   "exitCode": 1,
//   "stdoutOutput": "",
//   "stderrOutput": "hello world\n"
// }
```

## Open source notice

This project is open to updates by its users, [I](https://github.com/jeanlescure) ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing)

## Like this module? ❤

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) ☕
- Supporting Simply Hexagonal on [Open Collective](https://opencollective.com/simplyhexagonal) 🏆
- Starring this repo on [Github](https://github.com/simplyhexagonal/exec) 🌟

## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the `exec.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jeanlescure.cr"><img src="https://avatars2.githubusercontent.com/u/3330339?v=4" width="100px;" alt=""/><br /><sub><b>Jean Lescure</b></sub></a><br /><a href="#maintenance-jeanlescure" title="Maintenance">🚧</a> <a href="https://github.com/simplyhexagonal/exec/commits?author=jeanlescure" title="Code">💻</a> <a href="#userTesting-jeanlescure" title="User Testing">📓</a> <a href="https://github.com/simplyhexagonal/exec/commits?author=jeanlescure" title="Tests">⚠️</a> <a href="#example-jeanlescure" title="Examples">💡</a> <a href="https://github.com/simplyhexagonal/exec/commits?author=jeanlescure" title="Documentation">📖</a></td>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
## License

Copyright (c) 2021-Present [Exec Contributors](https://github.com/simplyhexagonal/exec/#contributors-).<br/>
Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
