/* Generic client-side calculator engine. Zero dependencies.
   Reads window.__CALC__ = { inputs, computeSrc, locale, currency } and wires up
   a live form -> results -> chart -> table on the page. */
(function () {
  "use strict";
  var C = window.__CALC__;
  if (!C) return;

  var root = document.getElementById("calc");
  if (!root) return;

  var compute = new Function("return (" + C.computeSrc + ")")();

  var moneyFmt = new Intl.NumberFormat(C.locale || "en-US", {
    style: "currency",
    currency: C.currency || "USD",
    maximumFractionDigits: 0,
  });
  var numFmt = new Intl.NumberFormat(C.locale || "en-US");
  var ctx = {
    money: function (n) {
      return moneyFmt.format(Math.round(n));
    },
    num: function (n, d) {
      return new Intl.NumberFormat(C.locale || "en-US", {
        maximumFractionDigits: d == null ? 2 : d,
      }).format(n);
    },
    pct: function (n) {
      return ctx.num(n, 2) + "%";
    },
  };

  // --- Build the form -------------------------------------------------------
  var form = document.createElement("form");
  form.className = "calc-form";
  form.setAttribute("novalidate", "");
  C.inputs.forEach(function (f) {
    var field = document.createElement("div");
    field.className = "field";

    var label = document.createElement("label");
    label.setAttribute("for", "f_" + f.id);
    label.textContent = f.label;
    field.appendChild(label);

    var wrap = document.createElement("div");
    wrap.className = "input-wrap" + (f.prefix ? " has-prefix" : "") + (f.suffix ? " has-suffix" : "");
    if (f.prefix) {
      var pre = document.createElement("span");
      pre.className = "affix prefix";
      pre.textContent = f.prefix;
      wrap.appendChild(pre);
    }
    var input;
    if (f.type === "select") {
      input = document.createElement("select");
      (f.options || []).forEach(function (o) {
        var opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.label;
        if (o.value === f.default) opt.selected = true;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("input");
      input.type = "number";
      input.value = f.default;
      if (f.min != null) input.min = f.min;
      if (f.max != null) input.max = f.max;
      if (f.step != null) input.step = f.step;
      input.setAttribute("inputmode", "decimal");
    }
    input.id = "f_" + f.id;
    input.name = f.id;
    input.className = "input";
    wrap.appendChild(input);
    if (f.suffix) {
      var suf = document.createElement("span");
      suf.className = "affix suffix";
      suf.textContent = f.suffix;
      wrap.appendChild(suf);
    }
    field.appendChild(wrap);

    if (f.help) {
      var help = document.createElement("p");
      help.className = "field-help";
      help.textContent = f.help;
      field.appendChild(help);
    }
    form.appendChild(field);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });
  root.appendChild(form);

  // --- Results containers ---------------------------------------------------
  var results = document.createElement("div");
  results.className = "calc-results";
  results.innerHTML =
    '<div class="summary" id="summary"></div>' +
    '<div class="chart-wrap" id="chartWrap"></div>' +
    '<p class="calc-note" id="note" hidden></p>' +
    '<details class="schedule"><summary>Show year-by-year breakdown</summary><div id="tableWrap"></div></details>';
  root.appendChild(results);

  var summaryEl = results.querySelector("#summary");
  var chartWrap = results.querySelector("#chartWrap");
  var tableWrap = results.querySelector("#tableWrap");
  var noteEl = results.querySelector("#note");

  function readValues() {
    var v = {};
    C.inputs.forEach(function (f) {
      var el = form.elements[f.id];
      var val = el.value;
      if (f.type !== "select") {
        val = parseFloat(val);
        if (isNaN(val)) val = 0;
      }
      v[f.id] = val;
    });
    return v;
  }

  function renderSummary(items) {
    summaryEl.innerHTML = "";
    items.forEach(function (s) {
      var card = document.createElement("div");
      card.className = "summary-card" + (s.primary ? " primary" : "");
      card.innerHTML =
        '<div class="summary-label"></div><div class="summary-value"></div>';
      card.querySelector(".summary-label").textContent = s.label;
      card.querySelector(".summary-value").textContent = s.value;
      summaryEl.appendChild(card);
    });
  }

  function renderTable(t) {
    if (!t) {
      tableWrap.innerHTML = "";
      return;
    }
    var html = '<table class="data-table"><thead><tr>';
    t.columns.forEach(function (c) {
      html += "<th>" + c + "</th>";
    });
    html += "</tr></thead><tbody>";
    t.rows.forEach(function (r) {
      html += "<tr>";
      r.forEach(function (cell) {
        html += "<td>" + cell + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";
    tableWrap.innerHTML = html;
  }

  function renderChart(chart) {
    if (!chart || !chart.series || !chart.series.length) {
      chartWrap.innerHTML = "";
      return;
    }
    var W = 640,
      H = 320,
      padL = 64,
      padR = 16,
      padT = 16,
      padB = 40;
    var plotW = W - padL - padR,
      plotH = H - padT - padB;
    var n = chart.series[0].points.length;
    var max = 0;
    chart.series.forEach(function (s) {
      s.points.forEach(function (p) {
        if (p > max) max = p;
      });
    });
    if (max <= 0) max = 1;
    // nice round max
    var pow = Math.pow(10, Math.floor(Math.log10(max)));
    max = Math.ceil(max / pow) * pow;

    function x(i) {
      return padL + (n <= 1 ? 0 : (i / (n - 1)) * plotW);
    }
    function y(val) {
      return padT + plotH - (val / max) * plotH;
    }
    function fmtY(val) {
      if (chart.yFormat === "money") {
        if (val >= 1000000) return ctx.money(val / 1000000).replace(/\.00$/, "") + "M";
        if (val >= 1000) return ctx.money(val / 1000).replace(/\.00$/, "") + "k";
        return ctx.money(val);
      }
      return ctx.num(val, 0);
    }

    var svg =
      '<svg viewBox="0 0 ' +
      W +
      " " +
      H +
      '" class="chart" role="img" aria-label="Results chart">';
    // y gridlines + labels
    var ticks = 4;
    for (var t = 0; t <= ticks; t++) {
      var val = (max / ticks) * t;
      var gy = y(val);
      svg +=
        '<line x1="' +
        padL +
        '" y1="' +
        gy +
        '" x2="' +
        (W - padR) +
        '" y2="' +
        gy +
        '" class="grid"/>';
      svg +=
        '<text x="' +
        (padL - 8) +
        '" y="' +
        (gy + 4) +
        '" class="axis-label y">' +
        fmtY(val) +
        "</text>";
    }
    // x labels (show a handful)
    var step = Math.max(1, Math.ceil(n / 8));
    for (var i = 0; i < n; i += step) {
      svg +=
        '<text x="' +
        x(i) +
        '" y="' +
        (H - padB + 20) +
        '" class="axis-label x">' +
        (chart.xLabels ? chart.xLabels[i] : i) +
        "</text>";
    }
    // series
    chart.series.forEach(function (s, si) {
      var d = "";
      s.points.forEach(function (p, i) {
        d += (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(p).toFixed(1) + " ";
      });
      if (si === 0) {
        var area =
          d +
          "L" +
          x(n - 1).toFixed(1) +
          " " +
          y(0).toFixed(1) +
          " L" +
          x(0).toFixed(1) +
          " " +
          y(0).toFixed(1) +
          " Z";
        svg += '<path d="' + area + '" fill="' + s.color + '" opacity="0.10"/>';
      }
      svg +=
        '<path d="' +
        d.trim() +
        '" fill="none" stroke="' +
        s.color +
        '" stroke-width="2.5" stroke-linejoin="round"/>';
    });
    svg += "</svg>";

    // legend
    var legend = '<div class="legend">';
    chart.series.forEach(function (s) {
      legend +=
        '<span class="legend-item"><span class="swatch" style="background:' +
        s.color +
        '"></span>' +
        s.name +
        "</span>";
    });
    legend += "</div>";

    chartWrap.innerHTML = svg + legend;
  }

  function recompute() {
    var v = readValues();
    var out;
    try {
      out = compute(v, ctx);
    } catch (err) {
      return;
    }
    renderSummary(out.summary || []);
    renderChart(out.chart);
    renderTable(out.table);
    if (out.note) {
      noteEl.textContent = out.note;
      noteEl.hidden = false;
    } else {
      noteEl.hidden = true;
    }
  }

  form.addEventListener("input", recompute);
  form.addEventListener("change", recompute);
  recompute();
})();
