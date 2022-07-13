import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { BodyPix } from '@tensorflow-models/body-pix'
import { useEffect } from 'react'
import { BackgroundConfig } from '../helpers/backgroundHelper'
import { PostProcessingConfig } from '../helpers/postProcessingHelper'
import { SegmentationConfig } from '../helpers/segmentationHelper'
import { SourcePlayback } from '../helpers/sourceHelper'
import useRenderingPipeline from '../hooks/useRenderingPipeline'
import { TFLite } from '../hooks/useTFLite'

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

  return (
    <div className={classes.root}>
      {/* {props.backgroundConfig.type === 'image' && (
        <img
          ref={backgroundImageRef}
          className={classes.render}
          src={props.backgroundConfig.url}
          alt=""
          hidden={props.segmentationConfig.pipeline === 'webgl2'}
        />
      )} */}
      <div id="capture">
        <canvas
          // The key attribute is required to create a new canvas when switching
          // context mode
          key={props.segmentationConfig.pipeline}
          ref={canvasRef}
          className={classes.render}
          width={props.sourcePlayback.width}
          height={props.sourcePlayback.height}
        />
      </div>
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
      top: 0,
      left: 0,
      position: 'static',
      width: '500px',
      height: '500px',
      objectFit: 'cover',
    },
  })
)

export default OutputViewer
