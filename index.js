#!/usr/bin/env node

const express = require('express');
const { addonBuilder } = require('stremio-addon-sdk');

const app = express();
const PORT = process.env.PORT || 7000;

// Example manifest
const manifest = {
  id: 'org.stremio.tizenbrew-addon',
  version: '1.0.0',
  name: 'TizenBrew Stremio Addon',
  description: 'Sample Stremio addon running on Samsung TVs via TizenBrew',
  resources: ['catalog', 'stream'],
  types: ['movie', 'series'],
  catalogs: [
    {
      type: 'movie',
      id: 'tizenbrewCatalog',
      name: 'TizenBrew Catalog'
    }
  ]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(({ type }) => {
  if (type === 'movie') {
    return Promise.resolve({
      metas: [
        { id: 'tt001', type: 'movie', name: 'Sample Movie', poster: 'https://via.placeholder.com/150' }
      ]
    });
  }
  return Promise.resolve({ metas: [] });
});

builder.defineStreamHandler(({ id }) => {
  if (id === 'tt001') {
    return Promise.resolve({
      streams: [
        { title: 'Sample Stream', url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' }
      ]
    });
  }
  return Promise.resolve({ streams: [] });
});

app.use('/', builder.getInterface());

app.listen(PORT, () => {
  console.log(`Addon running at http://localhost:${PORT}/manifest.json`);
});
