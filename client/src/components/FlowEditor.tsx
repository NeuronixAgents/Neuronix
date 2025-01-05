import ReactFlow, { 
  Background, 
  Controls,
  Node,
  Edge,
  Connection,
  NodeMouseHandler,
  OnConnectStartParams,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useCallback, useRef } from 'react';
import { SparkleGroup } from './Sparkle';

interface SparkleInstance {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

export function FlowEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [sparkles, setSparkles] = useState<SparkleInstance[]>([]);
  const sparkleIdCounter = useRef(0);
  const { project } = useReactFlow();

  const addSparkle = useCallback((x: number, y: number) => {
    const newSparkle = {
      id: sparkleIdCounter.current++,
      x,
      y,
      createdAt: Date.now(),
    };
    setSparkles(s => [...s, newSparkle]);
    setTimeout(() => {
      setSparkles(s => s.filter(spark => spark.id !== newSparkle.id));
    }, 1000);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const sourceNode = nodes.find(n => n.id === connection.source);
        const targetNode = nodes.find(n => n.id === connection.target);
        if (sourceNode && targetNode) {
          const midX = (sourceNode.position.x + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + targetNode.position.y) / 2;
          addSparkle(midX, midY);
        }
      }
      setEdges((eds) => [...eds, connection]);
    },
    [nodes, addSparkle],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const pos = project({ x: node.position.x, y: node.position.y });
      addSparkle(pos.x, pos.y);
    },
    [project, addSparkle],
  );

  const onConnectStart = useCallback(
    (_event: React.MouseEvent | React.TouchEvent, params: OnConnectStartParams) => {
      const sourceNode = nodes.find(n => n.id === params.nodeId);
      if (sourceNode) {
        const pos = project({ x: sourceNode.position.x, y: sourceNode.position.y });
        addSparkle(pos.x, pos.y);
      }
    },
    [nodes, project, addSparkle],
  );

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onConnectStart={onConnectStart}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
      </ReactFlow>
      {sparkles.map(sparkle => (
        <SparkleGroup
          key={sparkle.id}
          x={sparkle.x}
          y={sparkle.y}
        />
      ))}
    </div>
  );
}