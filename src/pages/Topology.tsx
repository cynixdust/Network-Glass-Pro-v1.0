import React, { useCallback } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/src/components/ui/card";
import { Server, Router, Shield, Database } from "lucide-react";

const initialNodes = [
  { 
    id: "isp", 
    position: { x: 400, y: 0 }, 
    data: { label: "Internet / ISP" },
    style: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "10px", width: 150 }
  },
  { 
    id: "fw", 
    position: { x: 400, y: 100 }, 
    data: { label: "Main Firewall" },
    style: { background: "#fee2e2", border: "1px solid #ef4444", borderRadius: "12px", padding: "10px", width: 150 }
  },
  { 
    id: "sw-core", 
    position: { x: 400, y: 200 }, 
    data: { label: "Core Switch" },
    style: { background: "#dcfce7", border: "1px solid #22c55e", borderRadius: "12px", padding: "10px", width: 150 }
  },
  { 
    id: "srv-web", 
    position: { x: 200, y: 350 }, 
    data: { label: "Web Server Cluster" },
    style: { background: "#dbeafe", border: "1px solid #3b82f6", borderRadius: "12px", padding: "10px", width: 150 }
  },
  { 
    id: "srv-db", 
    position: { x: 400, y: 350 }, 
    data: { label: "Database Server" },
    style: { background: "#dbeafe", border: "1px solid #3b82f6", borderRadius: "12px", padding: "10px", width: 150 }
  },
  { 
    id: "srv-storage", 
    position: { x: 600, y: 350 }, 
    data: { label: "Storage NAS" },
    style: { background: "#dbeafe", border: "1px solid #3b82f6", borderRadius: "12px", padding: "10px", width: 150 }
  },
];

const initialEdges = [
  { id: "e1-2", source: "isp", target: "fw", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e2-3", source: "fw", target: "sw-core", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3-4", source: "sw-core", target: "srv-web", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3-5", source: "sw-core", target: "srv-db", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "e3-6", source: "sw-core", target: "srv-storage", markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function Topology() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[calc(100vh-12rem)] space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Network Topology</h2>
        <p className="text-slate-500 mt-1">Visual map of your infrastructure connections and health.</p>
      </div>

      <Card className="h-full border-none shadow-sm rounded-2xl overflow-hidden bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#f1f5f9" gap={20} />
          <Controls />
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.id === 'fw') return '#ef4444';
              if (n.id === 'sw-core') return '#22c55e';
              return '#3b82f6';
            }}
            nodeColor={(n) => {
              if (n.id === 'fw') return '#fee2e2';
              if (n.id === 'sw-core') return '#dcfce7';
              return '#dbeafe';
            }}
          />
        </ReactFlow>
      </Card>
    </div>
  );
}
