import fingerprints from './fingerprints.json';

export interface ScanInput {
  html: string;
  scripts: string[];
  headers: Record<string, string | string[] | undefined>;
  globals: string[];
  meta: Array<{ name: string; content: string }>;
}

export interface DetectedTechDetail {
  category: string;
  name: string;
  confidence: number;
}

export class Scanner {
  private fingerprints: Record<string, any> = fingerprints;

  public detect(input: ScanInput): DetectedTechDetail[] {
    const results: DetectedTechDetail[] = [];
    const { html, scripts, headers, globals } = input;
    
    const normalizedHtml = html.toLowerCase();
    const normalizedScripts = scripts.map(s => s.toLowerCase());
    const normalizedHeaders: Record<string, string> = {};
    
    for (const [k, v] of Object.entries(headers)) {
      if (v !== undefined) {
        normalizedHeaders[k.toLowerCase()] = Array.isArray(v) 
          ? v.join(',').toLowerCase() 
          : v.toLowerCase();
      }
    }
    
    for (const [techName, fp] of Object.entries(this.fingerprints)) {
      let confidenceScore = 0;
      let matchedSignals = 0;

      // 1. HTML Matches
      if (fp.html) {
        for (const sig of fp.html) {
          if (normalizedHtml.includes(sig.toLowerCase())) {
            confidenceScore += 20;
            matchedSignals++;
          }
        }
      }

      // 2. Script Matches
      if (fp.scripts) {
        for (const sig of fp.scripts) {
          if (normalizedScripts.some(s => s.includes(sig.toLowerCase()))) {
            confidenceScore += 30;
            matchedSignals++;
          }
        }
      }

      // 3. Header Matches
      if (fp.headers) {
        for (const [headerKey, headerValue] of Object.entries(fp.headers)) {
          const key = headerKey.toLowerCase();
          const val = (headerValue as string).toLowerCase();
          if (normalizedHeaders[key] !== undefined) {
            if (val === '' || normalizedHeaders[key].includes(val)) {
              confidenceScore += 30;
              matchedSignals++;
            }
          }
        }
      }

      // 4. Global Objects Matches
      if (fp.globals) {
        for (const sig of fp.globals) {
          if (globals.includes(sig)) {
            confidenceScore += 40;
            matchedSignals++;
          }
        }
      }

      // We need either 2+ signals OR a strong confidence score (e.g. 40+)
      // Special allowance for header-only fingerprints (like Nginx) which might only have 1 signal
      const isHeaderOnly = fp.headers && !fp.html && !fp.scripts && !fp.globals;

      if (matchedSignals >= 2 || confidenceScore >= 40 || (matchedSignals === 1 && isHeaderOnly)) {
        const finalConfidence = Math.min(confidenceScore, 100);
        results.push({
          category: fp.category,
          name: techName,
          confidence: finalConfidence > 0 ? finalConfidence : 50
        });
      }
    }

    return results;
  }

  public getStructuredFormat(results: DetectedTechDetail[]) {
    const structured: Record<string, string[] | number> = {};
    let totalConfidence = 0;
    
    for (const res of results) {
      const key = res.category.toLowerCase().replace(/\s+/g, '_');
      if (!structured[key]) {
        structured[key] = [];
      }
      (structured[key] as string[]).push(res.name);
      totalConfidence += res.confidence;
    }
    
    structured.confidence = results.length > 0 
      ? parseFloat((totalConfidence / (results.length * 100)).toFixed(2))
      : 0;
      
    return structured;
  }
}
