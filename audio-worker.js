/* Encodes one chapter's sound (16-bit mono samples) as a smaller MP3.
   Uses lamejs (LAME MP3 encoder, LGPL -- see LAME-LICENSE.txt, https://lame.sourceforge.io). */
importScripts("lame.min.js");   // lamejs: LAME MP3 encoder (LGPL), see tools/LAME-LICENSE.txt

self.onmessage = function (e) {
  var m = e.data;
  try {
    var enc = new lamejs.Mp3Encoder(1, m.sr, m.kbps), out = [], size = 0, pcm = m.pcm, step = 1152 * 8;
    for (var i = 0; i < pcm.length; i += step) {
      var b = enc.encodeBuffer(pcm.subarray(i, Math.min(pcm.length, i + step)));
      if (b.length) { out.push(new Uint8Array(b)); size += b.length; }
    }
    var f = enc.flush();
    if (f.length) { out.push(new Uint8Array(f)); size += f.length; }
    var mp3 = new Uint8Array(size), o = 0;
    for (var k = 0; k < out.length; k++) { mp3.set(out[k], o); o += out[k].length; }
    self.postMessage({ id: m.id, mp3: mp3 }, [mp3.buffer]);
  } catch (err) {
    self.postMessage({ id: m.id, error: String(err && err.message || err) });
  }
};
