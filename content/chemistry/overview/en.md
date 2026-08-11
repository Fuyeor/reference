# Chemistry API

`chemistry` is a high-performance chemical structure rendering service in the [Ф](https://www.fuyeor.com/en/) ecosystem. It generates on‑demand SVG diagrams from SMILES strings, powered by RDKit. The diagrams are optimized for embedding in Markdown, HTML, and online platforms such as social media, forums, and academic websites.

## Example renders

| Molecule | SMILES | Structure |
| :--- | :--- | :--- |
| Ethanol | CCO | ![](https://chemistry.fuyeor.net/v1/depict?smiles=CCO) |
| Aspirin | CC(=O)OC1=CC=CC=C1C(=O)O | ![](https://chemistry.fuyeor.net/v1/depict?smiles=CC%28%3DO%29OC1%3DCC%3DCC%3DC1C%28%3DO%29O) |
| Caffeine | CN1C=NC2=C1C(=O)N(C(=O)N2C)C | ![](https://chemistry.fuyeor.net/v1/depict?smiles=CN1C%3DNC2%3DC1C%28%3DO%29N%28C%28%3DO%29N2C%29C) |

## Next steps

- Configure your [local development environment](./development) to build and debug the `chemistry` service.
- Explore the [API endpoint](./apis/depict), parameters, and response formats.
- Learn how to [embed in Markdown or HTML](./integration/embed), or [integrate with JavaScript](./integration/javascript/native).