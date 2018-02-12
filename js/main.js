/* global vegaEmbed, vegaTooltip $ */
'use strict'

$(() => {
  const $vis = $('#vis')
  // const visEl = $vis[0]

  const yourVlSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
    // width: '100%',
    // height: '100%',
    width: 800,
    height: 600,
    // width: 1700,
    // height: 900,
/*
    autosize: {
      type: 'pad', // fit or pad or none
      resize: true,
      contains: 'content' // or 'padding' or 'content'
    },
*/
    // actions: false,
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

  const opts = {
    // renderer: 'svg',
    actions: false
  }

  vegaEmbed($vis[0], yourVlSpec, opts)
    .then(({ view }) => {
      // console.log(Object.keys(view), view)
      const $it = $('svg', $vis)
      $it.css('width', '100%')
      $it.css('height', '100%')
      vegaTooltip.vegaLite(view, yourVlSpec)
    })
    .catch(console.error)
})
