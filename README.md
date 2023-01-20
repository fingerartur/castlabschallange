# Cast Labs Challenge
Micro ISOBMFF parser app

## Start the app
```bash
# start the app on localhost
yarn && yarn start
```

## Compatibility
Tested in Chrome version 108.0.5359.71 (MacOS) and Edge version 108.0.1462.42 (Windows)

## Architecture
![](./doc/architecture.svg)

## Limitations

1. Nesting of boxes in the ISOBMFF media file can be max 1000 levels deep.

## Notes about large MDAT box

If the contents of MDAT box(es) is very large, the app will consume a lot of RAM and it may even run out of memory, depending on how much RAM is available.

While processing an MDAT box, the app consumes approx. 4x the RAM taken up by the MDAT box content, because it makes 4 copies  (one binary copy, one text and one parsed XML DOM tree). Until the copies are garbage collected, we can expect a spike in RAM 4x the size of the MDAT box data.

![](./doc/mdat_problem.svg)

It would be possible to optimize RAM usage by reading the MP4 file as a stream, processing it chunk by chunk and printing output to console chunk by chunk as well.

If images contained in the XML file are relatively small compared to the overall size of the XML file, their extraction could also be optimized by using a SAX parer that parses XML sequentially instead of parsing the whole DOM tree.

```
npx get-video-mime ./public/video2.mp4
```


https://stackoverflow.com/questions/8616855/how-to-output-fragmented-mp4-with-ffmpeg

## Notes on MediaSource
1. appendBuffer takes any chunk, it does not have to be logical segment - I do not have to parse MP4 before sending it there, i can just chunk it very stupidly and send it to `SourceBuffer.appendBuffer`.
2. The MP4 that I send to MSE must be a specific MP4. Not all MP4s are supported! I am not talking about a codec. [The MP4 must be formatted with `ffmpeg -movflags frag_keyframe+empty_moov+default_base_moof`](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API/Transcoding_assets_for_MSE).
   1. This is pretty badly documented on MDN, that is why [somebody is complaining here](https://stackoverflow.com/questions/42234078/html5-mediasource-works-with-some-mp4-files-and-not-with-others-same-codecs), it should be documented better.
3. When feeding MP4 via MSE I see the following
   1. When MediaSource does not have enough data, it is buffering
   2. Until **all** the data of the whole MP4 has been fed into MediaSource, the progress bar does not work (progress is cca 95% and duration is unknown). Maybe it is possible to format the MP4 in a better way so that the duration is known.
