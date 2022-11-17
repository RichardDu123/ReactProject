// React
import { useRef, useState } from 'react';

// Utils
import { animated } from '@react-spring/three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import {
  OrthographicCamera,
  OrbitControls,
  TransformControls,
} from '@react-three/drei';
import { Canvas, useLoader, extend } from '@react-three/fiber';
import create from 'zustand';

// MUI
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';

// Assets
import hellofont from './../../images/Font Brush_Regular.json';

// CSS
import './index.scss';

const useStore = create((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
}));
const useCamera = create((set) => ({
  position: [1000, 800, 1000],
  setPosition: (position) => set({ position }),
}));
extend({ TextGeometry });

const ImageItem = ({ item, editable, handleDelete }) => {
  const setTarget = useStore((state) => state.setTarget);
  const colorMap = useLoader(TextureLoader, item.url);

  return (
    <animated.mesh
      position={item.position}
      scale={item.scale}
      rotation={item.rotation}
      canvasItemId={item.canvasItemId}
      onClick={(e) => {
        if (editable) {
          setTarget(e.object);
        }
      }}
      onDoubleClick={() => {
        if (editable) {
          handleDelete(item.canvasItemId);
        }
      }}
    >
      <boxGeometry />
      <meshStandardMaterial attach="material" map={colorMap} />
    </animated.mesh>
  );
};
const DashboardGarageCanvas = ({
  garageName,
  items,
  editable,
  handleMove,
  handleDelete,
}) => {
  const group = useRef();
  const { target, setTarget } = useStore();
  const [mode, setMode] = useState('translate');
  const changeMode = (e) => {
    setMode(e.target.value);
  };
  const { position, } = useCamera();
  const font = new FontLoader().parse(hellofont);

  return (
    <div id="dashboard_garage_canvas">
      {editable ? (
        <div className="dashboard_garage_canvas_header">
          <Tooltip
            title="please double click item to delete item"
            placement="right"
          >
            <Button>
              <DeleteIcon />
            </Button>
          </Tooltip>
          <div className="dashboard_garage_canvas_header_actions">
            <FormControl id="dashboard_garage_canvas_header_actions_select">
              <InputLabel id="demo-simple-select-label">Mode</InputLabel>
              <Select value={mode} label="mode" onChange={changeMode}>
                <MenuItem value={'translate'}>translate</MenuItem>
                <MenuItem value={'rotate'}>rotate</MenuItem>
                <MenuItem value={'scale'}>scale</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      ) : null}
      <Canvas
        style={{ background: '#cfcdcd29', height: '900px' }}
        shadows
        dpr={[1, 2]}
        onPointerMissed={(e) => {
          setTarget(null);
        }}
      >
        <group ref={group}>
          <ambientLight intensity={0.2} />
          <directionalLight />
          <gridHelper args={[100, 100]} position={[0, -40, 0]} />
          {items.map((item, index) => (
            <ImageItem
              item={item}
              key={index}
              handleMove={handleMove}
              editable={editable}
              handleDelete={handleDelete}
            ></ImageItem>
          ))}
          {target && editable && (
            <TransformControls
              size={1}
              object={target}
              mode={mode}
              onMouseUp={() => {
                if (target) {
                  const { x, y, z } = target.position;
                  const canvasItemId = target.canvasItemId;
                  const { _x, _y, _z } = target.rotation;
                  const scale = target.scale;
                  handleMove(
                    canvasItemId,
                    [x, y, z],
                    [_x, _y, _z],
                    [scale.x, scale.y, scale.z]
                  );
                }
                setTarget(null);
              }}
            />
          )}

          <mesh position={[-50, -35, 48]} rotation={[-0.2, 0, 0]} visible>
            <textGeometry
              attach="geometry"
              args={[
                garageName ? `Welcome to '${garageName}'` : '',
                { font, size: 6, height: 2 },
              ]}
            />
            <meshStandardMaterial attach="material" color="black" />
          </mesh>

          <OrbitControls makeDefault />
          <OrthographicCamera makeDefault zoom={6} position={position} />
        </group>
      </Canvas>
    </div>
  );
};
export default DashboardGarageCanvas;
