/* global vegaEmbed, vegaTooltip $ */
'use strict'

// console.log(Date.parse('2018-02-10'))

$(() => {
  const $vis1 = $('#vis')
  const $selectVis = $('#selectvis')
  const $spinner = $('#spinner')
  // const $before = $('input[name=before]')
  // const $after = $('input[name=after]')

  const width = $vis1.width() - 25
  const height = Math.min(800, width * 0.618)
  // const elDate = Date.now() - (86400 * 1000 * 7)

  const zz = ($vis, spec) => vegaEmbed($vis[0], spec, { actions: false })
    .then(({ view }) => Promise.all([view, spec, vegaTooltip.vegaLite(view, spec)]))
    .then(([view, spec]) => ({ view, spec }))

  // const setup = () => window.fetch('places-times.json')
  const setup = () => window.fetch('highs.json')
  // const setup = () => window.fetch('lows.json')
    .then((res) => res.json())
    .then((json) => {
      console.log(json[0], json.length)
      return {
        $schema: 'https://vega.github.io/schema/vega-lite/v2.json',
        width,
        height,
        autosize: {
          resize: true,
          contains: 'content', // or 'padding' or 'content'
          type: 'fit' // fit or pad or none
        },
        description: 'A simple bar chart with embedded data.',

        transform: [
          // { filter: '!indexof(datum.place, "CIUSSS")' },
          // { filter: '!indexof(datum.place, "CHU ")' },
          {
            calculate: 'datum.place ? slice(datum.place, 0, indexof(datum.place, " / ")) : "NA"',
            as: 'name'
          },
/*
          {
            calculate: '(datum.pat > datum.civ) ? (datum.pat / datum.civ) : 0',
            as: 'pc'
          },
          {
            calculate: 'datum.x24 + datum.x48',
            as: 'xtr'
          }
*/
        ],

        data: {
          // const elDate = Date.now() - (86400 * 1000 * 7)
          // we need to keep the whole thing if we want to refilter it
          // values: json.filter((x) => !x.place.indexOf('C') && Date.parse(x.update) > elDate)
          // values: json.filter((x) => !x.place.indexOf('CISSS ') && x.update.indexOf('T21:') ==-1)
          values: json // .filter((x) => !x || !x.place.indexOf('CISSS '))
        },
        mark: 'bar',
        encoding: {
          x: {
            field: 'update',
            type: 'temporal'
          },
          y: {
            aggregate: 'sum',
            field: 'pat',
            type: 'quantitative'
          },
          color: {
            field: 'name',
            type: 'nominal'
          }
        }
      }
    })
    .then((spec) => {
      $selectVis.on('click', 'li', (ev) => {
        // console.log(ev.target.innerText)
        // console.log('before:', $before.val())
        // console.log('after:', $after.val())

        // $vis1.html('<p>Hello world</p>')
        $vis1.empty()
        // $spinner.clone().appendTo($vis1)
        $spinner.show()

        window.setTimeout(() => {
          const s = { ...spec }
          switch (ev.target.innerText) {
            case 'civ':
              s.encoding.y.field = 'civ'
              s.title = 'Nombre de civières'
              break

            case 'pat':
              s.encoding.y.field = 'pat'
              s.title = 'Nombre de patients sur civières'
              break

            case 'x24':
              s.encoding.y.field = 'x24'
              s.title = 'Nombre de patients sur civières depuis plus de 24h'
              break

            case 'x48':
              s.encoding.y.field = 'x48'
              s.title = 'Nombre de patients sur civières depuis plus de 48h'
              break
          }
          const now = Date.now()
          zz($vis1, s)
            .then((x) => {
              $spinner.hide()
              console.log((Date.now() - now) / s.data.values.length, Date.now() - now, s.data.values.length, x)
            })
            .catch(console.error)
        }, 1000)
      })
      return spec
    })

  setup()
    .then((spec) => zz($vis1, spec))
    .then(console.log)
    .catch(console.error)
})
