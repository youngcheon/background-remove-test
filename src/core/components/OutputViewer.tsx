import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BodyPix } from '@tensorflow-models/body-pix'
import { useEffect, useState } from 'react'
import { BackgroundConfig } from '../helpers/backgroundHelper'
import { PostProcessingConfig } from '../helpers/postProcessingHelper'
import { SegmentationConfig } from '../helpers/segmentationHelper'
import { SourcePlayback } from '../helpers/sourceHelper'
import useRenderingPipeline from '../hooks/useRenderingPipeline'
import { TFLite } from '../hooks/useTFLite'
import image1 from '../../04.jpg'
import image2 from '../../moon.png'
import image3 from '../../07.jpg'
type OutputViewerProps = {
  sourcePlayback: SourcePlayback
  backgroundConfig: BackgroundConfig
  segmentationConfig: SegmentationConfig
  postProcessingConfig: PostProcessingConfig
  bodyPix: BodyPix
  tflite: TFLite
}

function OutputViewer(props: OutputViewerProps) {
  const classes = useStyles()
  const {
    pipeline,
    backgroundImageRef,
    canvasRef,
    fps,
    durations: [resizingDuration, inferenceDuration, postProcessingDuration],
  } = useRenderingPipeline(
    props.sourcePlayback,
    props.backgroundConfig,
    props.segmentationConfig,
    props.bodyPix,
    props.tflite
  )

  useEffect(() => {
    if (pipeline) {
      pipeline.updatePostProcessingConfig(props.postProcessingConfig)
    }
  }, [pipeline, props.postProcessingConfig])

  const statDetails = [
    `resizing ${resizingDuration}ms`,
    `inference ${inferenceDuration}ms`,
    `post-processing ${postProcessingDuration}ms`,
  ]
  const stats = `${Math.round(fps)} fps (${statDetails.join(', ')})`
  const photoarray = [image1, image2, image3]
  let [bg, setBg] = useState(0)
  return (
    <div>
      {/* {props.backgroundConfig.type === 'image' && (
        <img
          ref={backgroundImageRef}
          className={classes.render}
          src={props.backgroundConfig.url}
          alt=""
          hidden={props.segmentationConfig.pipeline === 'webgl2'}
        />
      )} */}
      <div id="capture" className={classes.box}>
        <canvas
          // The key attribute is required to create a new canvas when switching
          // context mode
          key={props.segmentationConfig.pipeline}
          ref={canvasRef}
          className={classes.render}
          width={props.sourcePlayback.width}
          height={props.sourcePlayback.height}
        />
        <img src={photoarray[bg]} className={classes.image}></img>
      </div>
      <button
        onClick={() => {
          setBg(0)
        }}
      >
        사진1
      </button>
      <button
        onClick={() => {
          setBg(1)
        }}
      >
        사진2
      </button>
      <button
        onClick={() => {
          setBg(2)
        }}
      >
        사진3
      </button>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flex: 1,
      // position: 'relative',
    },
    render: {
      // // top: 0,
      // // left: 0,
      // // position: 'static',
      // width: '500px',
      // height: '500px',
      // objectFit: 'cover',
      position: 'absolute',
    },
    box: {
      position: 'relative',
      width: '640px',
      height: '480px',
      // objectFit: 'cover',
    },
    image: {
      poistion: 'absolute',
      width: '640px',
      height: '480px',
      objectFit: 'cover',
    },
  })
)

export default OutputViewer
