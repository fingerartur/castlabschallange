export const xml = `<?xml version="1.0" encoding="UTF-8"?>
<tt xml:lang="spa" xmlns="http://www.w3.org/ns/ttml" xmlns:tts="http://www.w3.org/ns/ttml#styling" xmlns:smpte="http://www.smpte-ra.org/schemas/2052-1/2010/smpte-tt">
  <head>
    <smpte:information smpte:mode="Enhanced" />
    <styling>
      <style xml:id="emb" tts:fontSize="4.1%" tts:fontFamily="monospaceSansSerif" />
      <style xml:id="ttx" tts:fontSize="3.21%" tts:fontFamily="monospaceSansSerif" />
      <style xml:id="backgroundStyle" tts:fontFamily="proportionalSansSerif" tts:fontSize="18px" tts:textAlign="center" tts:origin="0% 66%" tts:extent="100% 33%" tts:backgroundColor="rgba(0,0,0,0)" tts:displayAlign="center" />
      <style xml:id="speakerStyle" style="backgroundStyle" tts:color="white" tts:textOutline="black 1px" tts:backgroundColor="transparent" />
      <style xml:id="textStyle" style="speakerStyle" tts:color="white" tts:textOutline="none" tts:backgroundColor="black" />
    </styling>
    <layout>
      <region xml:id="full" tts:origin="0% 0%" tts:extent="100% 100%" tts:zIndex="1" />
      <region xml:id="speaker" style="speakerStyle" tts:zIndex="1" />
      <region xml:id="background" style="backgroundStyle" tts:zIndex="0" />
    </layout>
    <metadata>
      <smpte:image xml:id="image001" imagetype="PNG" encoding="Base64">
        IMG1
</smpte:image>
      <smpte:image xml:id="image002" imagetype="PNG" encoding="Base64">
        IMG2
</smpte:image>
    </metadata>
  </head>
  <body>
    <div>

      <!-- image-based SMPTE-TT -->
      <p region="full" begin="00:00:00.000" end="00:00:02.000" smpte:backgroundImage="image003"></p>
    </div>
  </body>
</tt>`
