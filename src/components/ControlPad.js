import React, { Fragment, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import Tone from "tone";

const ControlSurface = styled("div")`
  width: 70vh;
  height: 70vh;
  border: 5px solid ${(props) => (props.active ? "#eb4d4b" : "#22a6b3")};
  padding: 2rem;
  margin-top: 2rem;
  cursor: crosshair;
  background-color: #2d2d2d;
  -webkit-box-shadow: 25px 25px 0px 0px rgba(142, 142, 142, 1);
  -moz-box-shadow: 25px 25px 0px 0px rgba(142, 142, 142, 1);
  box-shadow: 25px 25px 0px 0px rgba(142, 142, 142, 1);
`;

const H1 = styled("h1")`
  @import url("https://fonts.googleapis.com/css2?family=Space+Mono&display=swap");
  font-size: 2.2rem;
  margin: 1.2rem 0;
  font-family: "Space Mono", "Courier New", Courier, monospace;
  font-weight: bold;
`;

function useTrackMouseInElement(ref) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);

  const onMouseMove = ({ clientX, clientY }) => {
    const offsetLeft =
      (clientX - ref.current.offsetLeft) / ref.current.offsetWidth;
    const offsetTop =
      (clientY - ref.current.offsetTop) / ref.current.offsetHeight;
    setOffsetLeft(offsetLeft);
    setOffsetTop(offsetTop);
  };
  const onMouseOver = () => setHovered(true);
  const onMouseOut = () => {
    setHovered(false);
    setClicked(false);
  };
  const onMouseDown = () => setClicked(true);
  const onMouseUp = () => setClicked(false);

  const handleMouse = {
    onMouseMove,
    onMouseOver,
    onMouseOut,
    onMouseDown,
    onTouchStart: onMouseDown,
    onMouseUp,
    onTouchEnd: onMouseUp,
  };

  return {
    handleMouse,
    offsetLeft,
    offsetTop,
    hovered,
    clicked,
  };
}

function useTheremin({ playing, pitchControl, volumeControl }) {
  const synth = useRef();
  const pitchInterpolater = useRef();
  const volumeInterpolater = useRef();
  const startedRef = useRef(false);

  useEffect(() => {
    synth.current = new Tone.FMSynth().toMaster();
    // pitchInterpolater.current = new Tone.CtrlInterpolate([40, 2000]);
    pitchInterpolater.current = new Tone.CtrlInterpolate([200, 1500]);
    volumeInterpolater.current = new Tone.CtrlInterpolate([5, -20]);

    return () => {
      synth.current.dispose();
      pitchInterpolater.current.dispose();
      volumeInterpolater.current.dispose();
    };
  }, []);

  useEffect(() => {
    const started = startedRef.current;
    pitchInterpolater.current.index = pitchControl;
    const pitch = pitchInterpolater.current.value;
    volumeInterpolater.current.index = volumeControl;
    const volume = volumeInterpolater.current.value;

    synth.current.setNote(pitch);
    synth.current.volume.value = volume;

    if (playing && !started) {
      synth.current.triggerAttack(pitch);
      startedRef.current = true;
    }

    if (!playing && started) {
      synth.current.triggerRelease();
      startedRef.current = false;
    }
  }, [playing, pitchControl, volumeControl]);
}

export default function ControlPad() {
  const container = useRef();
  const {
    offsetLeft,
    offsetTop,
    handleMouse,
    clicked,
  } = useTrackMouseInElement(container);

  useTheremin({
    playing: clicked,
    pitchControl: offsetLeft,
    volumeControl: offsetTop,
  });

  return (
    <Fragment>
      <H1>React Hooks Theremin</H1>
      <ControlSurface active={clicked} ref={container} {...handleMouse} />
    </Fragment>
  );
}
