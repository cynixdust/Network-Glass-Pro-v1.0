import React, { useCallback, useMemo, useEffect } from "react";
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Node,
  Edge
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/src/components/ui/card";
import { Server, Router, Shield, Database, Globe, Cpu, Activity, Share2 } from "lucide-react";
import { useDevices } from "@/src/lib/DeviceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { cn } from "@/src/lib/utils";

export default function Topology() {
  const { devices } = useDevices();
  const [activeTab, setActiveTab] = React.useState("connections");

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
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
    ];

    // Add devices from context
    devices.forEach((device, index) => {
      const xOffset = (index - (devices.length - 1) / 2) * 200;
      const isHealthy = device.status === "UP";
      
      nodes.push({
        id: device.id,
        position: { x: 400 + xOffset, y: 350 },
        data: { 
          label: (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                {device.type === "SERVER" ? <Server size={14} /> : <Router size={14} />}
                <span className="font-bold">{device.hostname}</span>
              </div>
              {activeTab === "health" && (
                <div className="flex items-center gap-1 mt-1">
                  <div className={cn("w-2 h-2 rounded-full", isHealthy ? "bg-emerald-500" : "bg-red-500")} />
                  <span className="text-[10px] text-slate-500 uppercase font-bold">{device.status}</span>
                </div>
              )}
            </div>
          )
        },
        style: { 
          background: activeTab === "health" 
            ? (isHealthy ? "#f0fdf4" : "#fef2f2")
            : (isHealthy ? "#dbeafe" : "#f1f5f9"), 
          border: `1px solid ${activeTab === "health"
            ? (isHealthy ? "#22c55e" : "#ef4444")
            : (isHealthy ? "#3b82f6" : "#94a3b8")}`, 
          borderRadius: "12px", 
          padding: "10px", 
          width: 150,
          opacity: device.status === "DOWN" && activeTab === "connections" ? 0.6 : 1
        }
      });
    });

    return nodes;
  }, [devices, activeTab]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [
      { id: "e1-2", source: "isp", target: "fw", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      { id: "e2-3", source: "fw", target: "sw-core", animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
    ];

    // Connect all devices to the core switch
    devices.forEach((device) => {
      const isHealthy = device.status === "UP";
      edges.push({
        id: `e-sw-${device.id}`,
        source: "sw-core",
        target: device.id,
        animated: isHealthy,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { 
          stroke: activeTab === "health"
            ? (isHealthy ? "#22c55e" : "#ef4444")
            : (isHealthy ? "#3b82f6" : "#94a3b8"),
          strokeWidth: activeTab === "health" ? 2 : 1
        }
      });
    });

    return edges;
  }, [devices, activeTab]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes/edges when devices change
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-[calc(100vh-12rem)] space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Network Topology</h2>
          <p className="text-slate-500 mt-1">Visual map of your infrastructure connections and health.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
            <TabsTrigger value="connections" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Share2 className="w-4 h-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="health" className="rounded-lg gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Activity className="w-4 h-4" />
              Health Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
