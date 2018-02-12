/* global vegaEmbed, vegaTooltip $ */
'use strict'

$(() => {
  const yourVlSpec = {
    width: 1000,
    height: 700,
    $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
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

  vegaEmbed('#vis', yourVlSpec)
    .then(({ view }) => vegaTooltip.vegaLite(view, yourVlSpec))
    .catch(console.error)
})
