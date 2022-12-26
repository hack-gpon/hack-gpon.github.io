(function (jtd, undefined) {

// Event handling

jtd.addEvent = function(el, type, handler) {
  if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
}
jtd.removeEvent = function(el, type, handler) {
  if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
}
jtd.onReady = function(ready) {
  // in case the document is already rendered
  if (document.readyState!='loading') ready();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', ready);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function(){
      if (document.readyState=='complete') ready();
  });
}

// Show/hide mobile menu

function initNav() {
  jtd.addEvent(document, 'click', function(e){
    var target = e.target;
    while (target && !(target.classList && target.classList.contains('nav-list-expander'))) {
      target = target.parentNode;
    }
    if (target) {
      e.preventDefault();
      target.parentNode.classList.toggle('active');
    }
  });

  const siteNav = document.getElementById('site-nav');
  const mainHeader = document.getElementById('main-header');
  const menuButton = document.getElementById('menu-button');

  jtd.addEvent(menuButton, 'click', function(e){
    e.preventDefault();

    if (menuButton.classList.toggle('nav-open')) {
      siteNav.classList.add('nav-open');
      mainHeader.classList.add('nav-open');
    } else {
      siteNav.classList.remove('nav-open');
      mainHeader.classList.remove('nav-open');
    }
  });
}
// Site search

function initSearch() {
  var request = new XMLHttpRequest();
  request.open('GET', '/assets/js/search-data.json', true);

  request.onload = function(){
    if (request.status >= 200 && request.status < 400) {
      var docs = JSON.parse(request.responseText);
      
      lunr.tokenizer.separator = /[\s/]+/

      var index = lunr(function(){
        this.ref('id');
        this.field('title', { boost: 200 });
        this.field('content', { boost: 2 });
        this.field('relUrl');
        this.metadataWhitelist = ['position']

        for (var i in docs) {
          this.add({
            id: i,
            title: docs[i].title,
            content: docs[i].content,
            relUrl: docs[i].relUrl
          });
        }
      });

      searchLoaded(index, docs);
    } else {
      console.log('Error loading ajax request. Request status:' + request.status);
    }
  };

  request.onerror = function(){
    console.log('There was a connection error');
  };

  request.send();
}

function searchLoaded(index, docs) {
  var index = index;
  var docs = docs;
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var mainHeader = document.getElementById('main-header');
  var currentInput;
  var currentSearchIndex = 0;

  function showSearch() {
    document.documentElement.classList.add('search-active');
  }

  function hideSearch() {
    document.documentElement.classList.remove('search-active');
  }

  function update() {
    currentSearchIndex++;

    var input = searchInput.value;
    if (input === '') {
      hideSearch();
    } else {
      showSearch();
      // scroll search input into view, workaround for iOS Safari
      window.scroll(0, -1);
      setTimeout(function(){ window.scroll(0, 0); }, 0);
    }
    if (input === currentInput) {
      return;
    }
    currentInput = input;
    searchResults.innerHTML = '';
    if (input === '') {
      return;
    }

    var results = index.query(function (query) {
      var tokens = lunr.tokenizer(input)
      query.term(tokens, {
        boost: 10
      });
      query.term(tokens, {
        wildcard: lunr.Query.wildcard.TRAILING
      });
    });

    if ((results.length == 0) && (input.length > 2)) {
      var tokens = lunr.tokenizer(input).filter(function(token, i) {
        return token.str.length < 20;
      })
      if (tokens.length > 0) {
        results = index.query(function (query) {
          query.term(tokens, {
            editDistance: Math.round(Math.sqrt(input.length / 2 - 1))
          });
        });
      }
    }

    if (results.length == 0) {
      var noResultsDiv = document.createElement('div');
      noResultsDiv.classList.add('search-no-result');
      noResultsDiv.innerText = 'No results found';
      searchResults.appendChild(noResultsDiv);

    } else {
      var resultsList = document.createElement('ul');
      resultsList.classList.add('search-results-list');
      searchResults.appendChild(resultsList);

      addResults(resultsList, results, 0, 10, 100, currentSearchIndex);
    }

    function addResults(resultsList, results, start, batchSize, batchMillis, searchIndex) {
      if (searchIndex != currentSearchIndex) {
        return;
      }
      for (var i = start; i < (start + batchSize); i++) {
        if (i == results.length) {
          return;
        }
        addResult(resultsList, results[i]);
      }
      setTimeout(function() {
        addResults(resultsList, results, start + batchSize, batchSize, batchMillis, searchIndex);
      }, batchMillis);
    }

    function addResult(resultsList, result) {
      var doc = docs[result.ref];

      var resultsListItem = document.createElement('li');
      resultsListItem.classList.add('search-results-list-item');
      resultsList.appendChild(resultsListItem);

      var resultLink = document.createElement('a');
      resultLink.classList.add('search-result');
      resultLink.setAttribute('href', doc.url);
      resultsListItem.appendChild(resultLink);

      var resultTitle = document.createElement('div');
      resultTitle.classList.add('search-result-title');
      resultLink.appendChild(resultTitle);

      var resultDoc = document.createElement('div');
      resultDoc.classList.add('search-result-doc');
      resultDoc.innerHTML = '<svg viewBox="0 0 24 24" class="search-result-icon"><use xlink:href="#svg-doc"></use></svg>';
      resultTitle.appendChild(resultDoc);

      var resultDocTitle = document.createElement('div');
      resultDocTitle.classList.add('search-result-doc-title');
      resultDocTitle.innerHTML = doc.doc;
      resultDoc.appendChild(resultDocTitle);
      var resultDocOrSection = resultDocTitle;

      if (doc.doc != doc.title) {
        resultDoc.classList.add('search-result-doc-parent');
        var resultSection = document.createElement('div');
        resultSection.classList.add('search-result-section');
        resultSection.innerHTML = doc.title;
        resultTitle.appendChild(resultSection);
        resultDocOrSection = resultSection;
      }

      var metadata = result.matchData.metadata;
      var titlePositions = [];
      var contentPositions = [];
      for (var j in metadata) {
        var meta = metadata[j];
        if (meta.title) {
          var positions = meta.title.position;
          for (var k in positions) {
            titlePositions.push(positions[k]);
          }
        }
        if (meta.content) {
          var positions = meta.content.position;
          for (var k in positions) {
            var position = positions[k];
            var previewStart = position[0];
            var previewEnd = position[0] + position[1];
            var ellipsesBefore = true;
            var ellipsesAfter = true;
            for (var k = 0; k < 5; k++) {
              var nextSpace = doc.content.lastIndexOf(' ', previewStart - 2);
              var nextDot = doc.content.lastIndexOf('. ', previewStart - 2);
              if ((nextDot >= 0) && (nextDot > nextSpace)) {
                previewStart = nextDot + 1;
                ellipsesBefore = false;
                break;
              }
              if (nextSpace < 0) {
                previewStart = 0;
                ellipsesBefore = false;
                break;
              }
              previewStart = nextSpace + 1;
            }
            for (var k = 0; k < 10; k++) {
              var nextSpace = doc.content.indexOf(' ', previewEnd + 1);
              var nextDot = doc.content.indexOf('. ', previewEnd + 1);
              if ((nextDot >= 0) && (nextDot < nextSpace)) {
                previewEnd = nextDot;
                ellipsesAfter = false;
                break;
              }
              if (nextSpace < 0) {
                previewEnd = doc.content.length;
                ellipsesAfter = false;
                break;
              }
              previewEnd = nextSpace;
            }
            contentPositions.push({
              highlight: position,
              previewStart: previewStart, previewEnd: previewEnd,
              ellipsesBefore: ellipsesBefore, ellipsesAfter: ellipsesAfter
            });
          }
        }
      }

      if (titlePositions.length > 0) {
        titlePositions.sort(function(p1, p2){ return p1[0] - p2[0] });
        resultDocOrSection.innerHTML = '';
        addHighlightedText(resultDocOrSection, doc.title, 0, doc.title.length, titlePositions);
      }

      if (contentPositions.length > 0) {
        contentPositions.sort(function(p1, p2){ return p1.highlight[0] - p2.highlight[0] });
        var contentPosition = contentPositions[0];
        var previewPosition = {
          highlight: [contentPosition.highlight],
          previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
          ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
        };
        var previewPositions = [previewPosition];
        for (var j = 1; j < contentPositions.length; j++) {
          contentPosition = contentPositions[j];
          if (previewPosition.previewEnd < contentPosition.previewStart) {
            previewPosition = {
              highlight: [contentPosition.highlight],
              previewStart: contentPosition.previewStart, previewEnd: contentPosition.previewEnd,
              ellipsesBefore: contentPosition.ellipsesBefore, ellipsesAfter: contentPosition.ellipsesAfter
            }
            previewPositions.push(previewPosition);
          } else {
            previewPosition.highlight.push(contentPosition.highlight);
            previewPosition.previewEnd = contentPosition.previewEnd;
            previewPosition.ellipsesAfter = contentPosition.ellipsesAfter;
          }
        }

        var resultPreviews = document.createElement('div');
        resultPreviews.classList.add('search-result-previews');
        resultLink.appendChild(resultPreviews);

        var content = doc.content;
        for (var j = 0; j < Math.min(previewPositions.length, 3); j++) {
          var position = previewPositions[j];

          var resultPreview = document.createElement('div');
          resultPreview.classList.add('search-result-preview');
          resultPreviews.appendChild(resultPreview);

          if (position.ellipsesBefore) {
            resultPreview.appendChild(document.createTextNode('... '));
          }
          addHighlightedText(resultPreview, content, position.previewStart, position.previewEnd, position.highlight);
          if (position.ellipsesAfter) {
            resultPreview.appendChild(document.createTextNode(' ...'));
          }
        }
      }
      var resultRelUrl = document.createElement('span');
      resultRelUrl.classList.add('search-result-rel-url');
      resultRelUrl.innerText = doc.relUrl;
      resultTitle.appendChild(resultRelUrl);
    }

    function addHighlightedText(parent, text, start, end, positions) {
      var index = start;
      for (var i in positions) {
        var position = positions[i];
        var span = document.createElement('span');
        span.innerHTML = text.substring(index, position[0]);
        parent.appendChild(span);
        index = position[0] + position[1];
        var highlight = document.createElement('span');
        highlight.classList.add('search-result-highlight');
        highlight.innerHTML = text.substring(position[0], index);
        parent.appendChild(highlight);
      }
      var span = document.createElement('span');
      span.innerHTML = text.substring(index, end);
      parent.appendChild(span);
    }
  }

  jtd.addEvent(searchInput, 'focus', function(){
    setTimeout(update, 0);
  });

  jtd.addEvent(searchInput, 'keyup', function(e){
    switch (e.keyCode) {
      case 27: // When esc key is pressed, hide the results and clear the field
        searchInput.value = '';
        break;
      case 38: // arrow up
      case 40: // arrow down
      case 13: // enter
        e.preventDefault();
        return;
    }
    update();
  });

  jtd.addEvent(searchInput, 'keydown', function(e){
    switch (e.keyCode) {
      case 38: // arrow up
        e.preventDefault();
        var active = document.querySelector('.search-result.active');
        if (active) {
          active.classList.remove('active');
          if (active.parentElement.previousSibling) {
            var previous = active.parentElement.previousSibling.querySelector('.search-result');
            previous.classList.add('active');
          }
        }
        return;
      case 40: // arrow down
        e.preventDefault();
        var active = document.querySelector('.search-result.active');
        if (active) {
          if (active.parentElement.nextSibling) {
            var next = active.parentElement.nextSibling.querySelector('.search-result');
            active.classList.remove('active');
            next.classList.add('active');
          }
        } else {
          var next = document.querySelector('.search-result');
          if (next) {
            next.classList.add('active');
          }
        }
        return;
      case 13: // enter
        e.preventDefault();
        var active = document.querySelector('.search-result.active');
        if (active) {
          active.click();
        } else {
          var first = document.querySelector('.search-result');
          if (first) {
            first.click();
          }
        }
        return;
    }
  });

  jtd.addEvent(document, 'click', function(e){
    if (e.target != searchInput) {
      hideSearch();
    }
  });
}

// Switch theme

jtd.getTheme = function() {
  var cssFile = document.querySelector('[rel="stylesheet"]');
  if(cssFile.hasAttribute('media')) return 'auto';

  var cssFileHref = cssFile.getAttribute('href');
  return cssFileHref.substring(cssFileHref.lastIndexOf('-') + 1, cssFileHref.length - 4);
}

jtd.setTheme = function(theme) {
  var cssFile = document.querySelector('[rel="stylesheet"]');
  var cssFiles = [...document.querySelectorAll('[rel="stylesheet"]')];
  var cssFile = cssFiles[0];
  if(cssFiles.length >= 1) {
    cssFiles.shift();
    cssFiles.forEach(it => it.remove());
    cssFile.removeAttribute('media');
  }
  if(theme === "auto") {
    cssFile.setAttribute('href', '/assets/css/just-the-docs-light.css');
    cssFile.setAttribute('media', '(prefers-color-scheme: light)');
    cssFile.insertAdjacentHTML('afterend', `<link rel="stylesheet" href="/assets/css/just-the-docs-dark.css" media="(prefers-color-scheme: dark)">`);
  } else {
    cssFile.setAttribute('href', '/assets/css/just-the-docs-' + theme + '.css');
  }
}

jtd.switchThemeButton = function(button, event) {
  const themes = ["auto", "light", "dark"];
  var currentTheme = jtd.getTheme();
  var nextTheme = themes[(themes.indexOf(currentTheme)+1)%themes.length];
  jtd.setTheme(nextTheme);
  button.getElementsByTagName('svg')[0].getElementsByTagName('use')[0].setAttribute('href',`#svg-${nextTheme}`);
}

function initSwitchThemeButton() {
  var buttons = [...document.getElementsByClassName("color-scheme-switch-theme-button")];
  buttons.forEach(button => jtd.addEvent(button, 'click', event => jtd.switchThemeButton(button, event)));
}

// Scroll site-nav to ensure the link to the current page is visible

function scrollNav() {
  const href = document.location.pathname;
  const siteNav = document.getElementById('site-nav');
  const targetLink = siteNav.querySelector('a[href="' + href + '"], a[href="' + href + '/"]');
  if(targetLink){
    const rect = targetLink.getBoundingClientRect();
    siteNav.scrollBy(0, rect.top - 3*rect.height);
  }
}

// Document ready

jtd.onReady(function(){
  initNav();
  initSearch();
  initSwitchThemeButton();
  scrollNav();
});

// Copy button on code

jtd.onReady(function(){

  var codeBlocks = document.querySelectorAll('div.highlighter-rouge, div.listingblock, figure.highlight');

  var svgCopied =  '<svg viewBox="0 0 24 24" class="copy-icon"><use xlink:href="#svg-copied"></use></svg>';
  var svgCopy =  '<svg viewBox="0 0 24 24" class="copy-icon"><use xlink:href="#svg-copy"></use></svg>';

  codeBlocks.forEach(codeBlock => {
    var copyButton = document.createElement('button');
    var timeout = null;
    copyButton.type = 'button';
    copyButton.ariaLabel = 'Copy code to clipboard';
    copyButton.innerHTML = svgCopy;
    codeBlock.append(copyButton);

    copyButton.addEventListener('click', function () {
      if(timeout === null) {
        var code = codeBlock.querySelector('code').innerText.trim();
        window.navigator.clipboard.writeText(code);

        copyButton.innerHTML = svgCopied;

        var timeoutSetting = 4000;

        timeout = setTimeout(function () {
          copyButton.innerHTML = svgCopy;
          timeout = null;
        }, timeoutSetting);
      }
    });
  });

});

})(window.jtd = window.jtd || {});



class uuencoding {
    /**
     * uuencode a value
     *
     * @param {(String|Buffer)} The value to be encoded.
     * @returns {String} The encoded value.
     */
    static encode(inString) {
        var stop = false;
        var inIndex = 0;
        var outIndex = 0;
        var bytesRead = 0;

        var inBytes = new Buffer(inString);
        var buffLen = inBytes.length;
        var outBytes = new Buffer(buffLen + buffLen / 3 + 1 + buffLen / 45 * 2 + 2 + 4);

        do {
            var n;
            var bytesLeft = buffLen - bytesRead;

            if (bytesLeft === 0) {
                break;
            }

            if (bytesLeft <= 45) {
                n = bytesLeft;
            } else {
                n = 45;
            }

            outBytes[outIndex++] = (n & 0x3F) + 32;

            for (var i = 0; i < n; i += 3) {
                if (buffLen - inIndex < 3) {
                    var padding = new Array(3);
                    var z = 0;

                    while (inIndex + z < buffLen) {
                        padding[z] = inBytes[inIndex + z];
                        ++z;
                    }

                    this.#encodeBytes(padding, 0, outBytes, outIndex);
                } else {
                    this.#encodeBytes(inBytes, inIndex, outBytes, outIndex);
                }

                inIndex += 3;
                outIndex += 4;
            }

            outBytes[outIndex++] = 10;
            bytesRead += n;

            if (n >= 45) {
                continue;
            }

            stop = true;
        } while (!stop);

        return outBytes.toString().substring(0, outIndex);
    }

    /**
     * uudecode a value
     *
     * @param {(String|Buffer)} The value to be decoded.
     * @returns {Buffer} The decoded value.
     */
    static decode(inString) {
        var stop = false;
        var inIndex = 0;
        var outIndex = 0;
        var totalLen = 0;

        var inBytes = new Buffer(inString);
        var buffLen = inBytes.length;
        var outBytes = new Buffer(buffLen);

        do {
            if (inIndex < buffLen) {
                var n = inBytes[inIndex] - 32 & 0x3F;

                ++inIndex;

                if (n > 45) {
                    throw 'Invalid Data';
                }

                if (n < 45) {
                    stop = true;
                }

                totalLen += n;

                while (n > 0) {
                    this.#decodeChars(inBytes, inIndex, outBytes, outIndex);
                    outIndex += 3;
                    inIndex += 4;
                    n -= 3;
                }

                ++inIndex;
            } else {
                stop = true;
            }
        } while (!stop);

        return outBytes.slice(0, totalLen);
    }

    // private helper functions
    static #encodeBytes(inBytes, inIndex, outBytes, outIndex) {
        var c1 = inBytes[inIndex] >>> 2;
        var c2 = inBytes[inIndex] << 4 & 0x30 | inBytes[inIndex + 1] >>> 4 & 0xF;
        var c3 = inBytes[inIndex + 1] << 2 & 0x3C | inBytes[inIndex + 2] >>> 6 & 0x3;
        var c4 = inBytes[inIndex + 2] & 0x3F;

        outBytes[outIndex] = (c1 & 0x3F) + 32;
        outBytes[outIndex + 1] = (c2 & 0x3F) + 32;
        outBytes[outIndex + 2] = (c3 & 0x3F) + 32;
        outBytes[outIndex + 3] = (c4 & 0x3F) + 32;
    }

    static #decodeChars(inBytes, inIndex, outBytes, outIndex) {
        var c1 = inBytes[inIndex];
        var c2 = inBytes[inIndex + 1];
        var c3 = inBytes[inIndex + 2];
        var c4 = inBytes[inIndex + 3];

        var b1 = (c1 - 32 & 0x3F) << 2 | (c2 - 32 & 0x3F) >> 4;
        var b2 = (c2 - 32 & 0x3F) << 4 | (c3 - 32 & 0x3F) >> 2;
        var b3 = (c3 - 32 & 0x3F) << 6 | c4 - 32 & 0x3F;

        outBytes[outIndex] = b1 & 0xFF;
        outBytes[outIndex + 1] = b2 & 0xFF;
        outBytes[outIndex + 2] = b3 & 0xFF;
    }
}

class asciiHex {
    static asciiToHex(str, prefix = "0x", glue = " ") {
        var prefixi = glue !== "" ? prefix : "";
        var prefixs = glue === "" ? prefix : "";
        var hex = prefixs + ([...str].map((elem, n) => prefixi+Number(str.charCodeAt(n)).toString(16)).join(glue));
        return hex;
    }
    static hexToAscii(str, prefix = "0x", separator = " ") {
        if(prefix != "" && str.startsWith(prefix)) 
            str = str.substring(prefix.length);
        var ascii = separator === "" ? getChunks(str.substring(2),2).map(el => String.fromCharCode(parseInt(el, 16))).join('') : str.split(separator).map(el => String.fromCharCode(Number(el))).join('');
        return ascii;
    }
}
/*
class gponSerial {
    #vendor;
    #progressive;
    constructor(vendor, progressive) {
        if(vendor.length == 4) {
            this.#vendor = vendor.toUpperCase();
        } else if(vendor.length == 8) {
            this.#vendor = asciiHex.hexToAscii(vendor,'','').toUpperCase();
        } else {
            throw "vendor length unvalid";
        }
        if(progressive.length == 8) {
            this.#progressive = progressive.toLowerCase();
        } else {
            throw "progressive length unvalid";
        }
    }
    constructor(serial) {
        if(serial.length == 12) {
            this.#vendor = serial.substring(0, 4).toUpperCase();
            this.#progressive = serial.substring(4).toLowerCase();
        } else if(serial.length == 16) {
            this.#vendor = asciiHex.hexToAscii(serial.substring(0, 8)).toUpperCase();
            this.#progressive = serial.substring(8).toLowerCase();
        }  else {
            throw "serial length unvalid";
        }
    }
    get [vendorHex]() {
        return ([...this.#vendor].map((elem, n) => Number(this.#vendor.charCodeAt(n)).toString(16)).join(''));
    }
    get [vendor]() {
        return this.#vendor;
    }
    get [progressive]() {
        return this.#progressive;
    }
    get [serial]() {
        return `${this.#vendor}${this.#progressive}`;
    }   
}

class gponPloam {
    #ploam;
    constructor(ploam) {
        if(ploam.length <= 10) {  
            this.#ploam = ([...gpon_password].map((elem, n) => Number(gpon_password.charCodeAt(n)).toString(16)).join(''));
            this.#ploam += '0'.repeat(20-gpon_password.length);
        }
        else if(ploam.length === 20) {
            this.#ploam = ploam;
        }
        else if(ploam.length === 22 && ploam.startsWith("0x")) {
            this.#ploam = ploam.substring(2);
        }
    }
    get [ploam]() {
        return asciiHex.hexToAscii(this.#ploam, '','');
    }
    get [ploamEncoding]() {
        return JSON.stringify(ploam);
    }
    get [ploamHex] () {
        return this.#ploam;
    }
}*/

class eeprom1 {
    hex;
  
    constructor(hex) {
        this.hex = hex;
    }

    getPart = function(startIndex, endIndex) {
        return this.hex.slice(startIndex*2, (endIndex+1)*2);
    }

    setPart = function(startIndex, endIndex, value) {
        let calcLength = (endIndex+1-startIndex)*2;
        console.log(value.length);
        if(value.length != calcLength) {
            value += '0'.repeat(calcLength-value.length);
        }
        console.log(calcLength);
        console.log(value.length);
        /*for(var i = startIndex, j =0; i<= endIndex; i++, j++) {
            this.hex[i*2] = value[i*2];
            this.hex[i*2+1] = value[i*2+1];
        }*/
    
        this.hex.splice(startIndex, calcLength, ...value);
    }

    get serial() {
        return this.getPart(233, 240);
    }

    set serial(value) {
        this.setPart(233, 240, value);
    }

    get ploam() {
        return this.getPart(191, 214);
    }

    set ploam(value) {
        this.setPart(191, 214, value);
    }

    get loid() {
        return this.getPart(191, 214);
    }

    set loid(value) {
        this.setPart(191, 214, value);
    }

    get lpwd() {
        return this.getPart(215, 231);
    }

    set lpwd(value) {
        this.setPart(215, 231, value);
    }

    get loidPloamSwitch() {
        return this.getPart(232, 232);
    }

    set loidPloamSwitch(value) {
        this.setPart(232, 232, value);
    }

    get equipmentID() {
        return this.getPart(512, 531);
    }

    set equipmentID(value) {
        this.setPart(512, 531, value);
    }

    get vendorID() {
        return this.getPart(532, 535);
    }

    set vendorID(value) {
        this.setPart(532, 535, value);
    }

    get macAddress() {
        return this.getPart(384, 389);
    }

    set macAddress(value) {
        this.setPart(384, 389, value);
    }
}
