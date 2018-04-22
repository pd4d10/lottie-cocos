function CCEffects(elem) {
  var i,
    len = elem.data.ef ? elem.data.ef.length : 0
  var filId = randomString(10)
  var fil = filtersFactory.createFilter(filId)
  var count = 0
  this.filters = []
  var filterManager
  for (i = 0; i < len; i += 1) {
    // filterManager = null
    // if (elem.data.ef[i].ty === 20) {
    //   count += 1
    //   filterManager = new CCTintFilter(fil, elem.effectsManager.effectElements[i])
    // } else if (elem.data.ef[i].ty === 21) {
    //   count += 1
    //   filterManager = new CCFillFilter(fil, elem.effectsManager.effectElements[i])
    // } else if (elem.data.ef[i].ty === 22) {
    //   filterManager = new CCStrokeEffect(elem, elem.effectsManager.effectElements[i])
    // } else if (elem.data.ef[i].ty === 23) {
    //   count += 1
    //   filterManager = new CCTritoneFilter(fil, elem.effectsManager.effectElements[i])
    // } else if (elem.data.ef[i].ty === 24) {
    //   count += 1
    //   filterManager = new CCProLevelsFilter(fil, elem.effectsManager.effectElements[i])
    // } else if (elem.data.ef[i].ty === 25) {
    //   count += 1
    //   filterManager = new CCDropShadowEffect(fil, elem.effectsManager.effectElements[i])
    // } else if (elem.data.ef[i].ty === 28) {
    //   //count += 1;
    //   filterManager = new CCMatte3Effect(fil, elem.effectsManager.effectElements[i], elem)
    // }
    // if (filterManager) {
    //   this.filters.push(filterManager)
    // }
  }
  if (count) {
    elem.globalData.defs.appendChild(fil)
    elem.layerElement.setAttribute('filter', 'url(' + locationHref + '#' + filId + ')')
  }
}

CCEffects.prototype.renderFrame = function(_isFirstFrame) {
  var i,
    len = this.filters.length
  for (i = 0; i < len; i += 1) {
    this.filters[i].renderFrame(_isFirstFrame)
  }
}
