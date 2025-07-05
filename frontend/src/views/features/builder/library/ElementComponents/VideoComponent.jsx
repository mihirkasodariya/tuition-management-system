import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import '@/assets/css/builder/video-component.css';
import { VideoOff } from 'lucide-react';

const VideoComponent = ({
  uuid,
  style,
  videoUrl,
  styleClass,
  outerStyle,
  sectionDetails,
  blockDetails,
}) => {
  const { activeSection, screenSize } = useSelector((state) => state.builderToolkitState);
  return (
    <div
      className={cn(
        'w-full max-w-5xl p-3',
        activeSection?.sub_block_uuid === uuid ? 'outline-2 outline-green-500 outline-dotted' : ''
      )}
    >
      <div
        id={uuid}
        data-section-uuid={sectionDetails?.uuid}
        data-block-uuid={blockDetails?.uuid}
        style={{
          ...style,
          width: screenSize === 'mobile' ? window.innerWidth : style?.width,
        }}
        className={cn('max-w-5xl min-w-64')}
      >
        {videoUrl ? (
          <div className="react-player-container">
            <ReactPlayer
              className={'react-player'}
              url={videoUrl}
              width="100%"
              height="100%"
              // loop={this.state.loop}
              // onError={(e) => {
              // 	this.setState({
              // 		notValidVideo: true,
              // 	});
              // 	this.props.setIsValidURL(false);
              // }}
              // onReady={(e) => {
              // 	this.setState({
              // 		notValidVideo: false,
              // 	});
              // 	this.props.setIsValidURL(true);
              // }}
              // playing={this.state.autoplay}
              controls
              // muted={this.state?.isFluid ? this.props.muteVideo : true}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 items-center justify-center h-full w-full bg-gray-200">
            <p className="text-gray-500">No video URL provided</p>
            <VideoOff className="ml-2 text-gray-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(VideoComponent);
