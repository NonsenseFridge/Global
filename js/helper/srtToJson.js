function parseSRT (data, options) {
    // declare needed variables and constants
    const subs = []
    const lines = data.split(/(?:\r\n|\r|\n)/gm)
    let endIdx = lastNonEmptyLine(lines) + 1
    let idx = 0
    let time
    let text
    let sub
  
    for (let i = 0; i < endIdx; i++) {
      sub = {}
      text = []
  
      i = nextNonEmptyLine(lines, i)
      sub.id = parseInt(lines[i++], 10)
  
      // Split on '-->' delimiter, trimming spaces as well
      time = lines[i++].split(/[\t ]*-->[\t ]*/)
  
      sub[options.propName.start || 'start'] = options.timeInText ? time[0] : toSeconds(time[0])
  
      // So as to trim positioning information from end
      idx = time[1].indexOf(' ')
      if (idx !== -1) {
        time[1] = time[1].substr(0, idx)
      }
      sub[options.propName.end || 'end'] = options.timeInText ? time[1] : toSeconds(time[1])
  
      // Build single line of text from multi-line subtitle in file
      while (i < endIdx && lines[i]) {
        text.push(lines[i++])
      }
  
      const textPropName = options.propName.text || 'text'
      // Join into 1 line, SSA-style linebreaks
      // Strip out other SSA-style tags
      sub[textPropName] = text.join(' ').replace(/\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi, '')
  
      const x = 'asdf'
  
      // Escape HTML entities
      sub[textPropName] = sub[textPropName].replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
      // Unescape great than and less than when it makes a valid html tag of a supported style (font, b, u, s, i)
      // Modified version of regex from Phil Haack's blog: http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
      // Later modified by kev: http://kevin.deldycke.com/2007/03/ultimate-regular-expression-for-html-tag-parsing-with-php/
      sub[textPropName] = sub[textPropName].replace(/&lt;(\/?(font|b|u|i|s))((\s+(\w|\w[\w\-]*\w)(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)(\/?)&gt;/gi, '<$1$3$7>')
      
      if (!options.ignoreLineBreaks) sub[textPropName] = sub[textPropName].replace(/\\N/gi, '<br />')
      else sub[textPropName] = sub[textPropName].replace(/\\N/gi, '')
  
      subs.push(sub)
    }
  
    return subs
  }


  var PF_SRT = function() {
    //SRT format
    var pattern = /(\d+)\n([\d:,]+)\s+-{2}\>\s+([\d:,]+)\n([\s\S]*?(?=\n{2}|$))/gm;
    var _regExp;
  
    var init = function() {
      _regExp = new RegExp(pattern);
    };
    var parse = function(f) {
      if (typeof(f) != "string")
        throw "Sorry, Parser accept string only.";
  
      var result = [];
      if (f == null)
        return _subtitles;
  
      f = f.replace(/\r\n|\r|\n/g, '\n')
  
      while ((matches = pattern.exec(f)) != null) {
        result.push(toLineObj(matches));
      }
      return result;
    }
    var toLineObj = function(group) {
      return {
        line: group[1],
        startTime: group[2],
        endTime: group[3],
        text: group[4]
      };
    }
    init();
    return {
      parse: parse
    }
  }();