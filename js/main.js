/* global vegaEmbed, vegaTooltip $ */
'use strict'

$(() => {
  const yourVlSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
    autosize: {
      resize: true,
      contains: 'content', // or 'padding' or 'content'
      type: 'fit' // fit or pad or none
    },
    description: 'A simple bar chart with embedded data.',
    transform: [
      // { filter: '!indexof(datum.place, "CIUSSS")' },
      { filter: '!indexof(datum.place, "CHU ")' },
      {
        calculate: 'slice(datum.place, 0, indexof(datum.place, " / "))',
        as: 'name'
      },
      {
        calculate: '(datum.pat > datum.civ) ? (datum.pat / datum.civ) : 0',
        as: 'pc'
      },
      {
        calculate: 'datum.x24 + datum.x48',
        as: 'x'
      }
    ],
    data: { url: 'places-times.json' },
    mark: 'bar',
    encoding: {
      x: {
        field: 'update',
        type: 'temporal'
      },
      y: {
        aggregate: 'sum',
        field: 'pc',
        type: 'quantitative'
      },
      color: {
        field: 'place',
        type: 'nominal'
      }
    }
  }

  const zz = ($vis, spec) => vegaEmbed(
    $vis[0],
    {
      ...spec,
      width: $vis.width(),
      height: Math.min(700, $vis.width() * 0.618)
    },
    { actions: false }
  )
    .then(({ view }) => Promise.all([vegaTooltip.vegaLite(view, spec), view, spec]))
    .then(([x, view, spec]) => ({ view, spec }))

  zz($('#vis'), yourVlSpec)
    .then(console.log)
    .catch(console.error)
})
