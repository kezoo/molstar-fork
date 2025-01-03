import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DefaultPluginSpec } from "molstar/lib/mol-plugin/spec";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import { createPluginUI } from "molstar/lib/mol-plugin-ui/index";
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18';
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { ParamDefinition } from "molstar/lib/mol-util/param-definition";
import { CameraHelperParams } from "molstar/lib/mol-canvas3d/helper/camera-helper";
import "molstar/build/viewer/molstar.css";

interface MolstarViewerProps {
  useInterface: boolean
  pdbId: string
  url?: string
  file?: {
    filestring?: string
    type?: string
  }
  dimensions?: number[]
  className?: string
  showControls?: boolean
  showAxes?: boolean
}
const MolstarViewer = (props: MolstarViewerProps) => {

  const { useInterface, pdbId, url, file, dimensions, className, showControls, showAxes } = props;
  const parentRef = useRef(null);
  const canvasRef = useRef(null);
  const plugin: any = useRef(null);
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    (async () => {
      if (useInterface) {
        const spec = DefaultPluginUISpec();
        spec.layout = {
          initial: {
            isExpanded: false,
            controlsDisplay: "reactive",
            showControls: true,
          }
        };
        if (parentRef.current) {
          plugin.current = await createPluginUI({
            target: parentRef.current, 
            render: renderReact18,
            spec
          });
        }
      } else {
        plugin.current = new PluginContext(DefaultPluginSpec());
        plugin.current.initViewer(canvasRef.current, parentRef.current);
        await plugin.current.init();
      }
      if (!showAxes) {
        plugin.current.canvas3d?.setProps({ camera: { helper: { axes: {
          name: "off", params: {}
        } } } });
      }
      await loadStructure({pdbId, url, file}, plugin.current);
      setInitialized(true);
    })();
    return () => {
      plugin.current = null

    }
  }, [])


  useEffect(() => {
    if (!initialized) return;
    (async() => {
      await loadStructure({pdbId, url, file}, plugin.current);
    })();
  }, [pdbId, url, file])


  useEffect(() => {
    if (plugin.current) {
      if (!showAxes) {
        plugin.current.canvas3d?.setProps({ camera: { helper: { axes: {
          name: "off", params: {}
        } } } })
      } else {
        plugin.current.canvas3d?.setProps({ camera: { helper: {
          axes: ParamDefinition.getDefaultValues(CameraHelperParams).axes
        } } })
      }
    }
  }, [showAxes]) 


  const loadStructure = async (
    {pdbId, url, file}: Partial<Pick<MolstarViewerProps, 'pdbId' | 'url' | 'file'>>, 
    plugin: any,
  ) => {
    if (plugin) {
      plugin.clear();
      if (file) {
        const data = await plugin.builders.data.rawData({
          data: file.filestring
        });
        const traj = await plugin.builders.structure.parseTrajectory(data, file.type);
        await plugin.builders.structure.hierarchy.applyPreset(traj, "default");
      } else {
        const structureUrl = url ? url : pdbId ? `https://files.rcsb.org/view/${pdbId}.cif` : null;
        if (!structureUrl) return;
        const data = await plugin.builders.data.download(
          { url: structureUrl }, {state: {isGhost: true}}
        );
        let extension = (structureUrl.split(".") || []).pop()?.replace("cif", "mmcif");
        if (extension && extension.includes("?"))
          extension = extension.substring(0, extension.indexOf("?"));
        const traj = await plugin.builders.structure.parseTrajectory(data, extension);
        await plugin.builders.structure.hierarchy.applyPreset(traj, "default");
      }
    }
  }

  const width = dimensions ? dimensions[0] : "100%";
  const height = dimensions ? dimensions[1] : "100%";

  if (useInterface) {
    return (
      <div style={{position: "absolute", width, height, overflow: "hidden"}}>
        <div ref={parentRef} style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 0}} />
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      style={{position: "relative", width, height}}
      className={className || "ContainerClassname"}
    >
      <canvas
        ref={canvasRef}
        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
        data-canvas='canvas-3d'
      />
    </div>
  );
};

/* Molstar.propTypes = {
  useInterface: PropTypes.bool,
  pdbId: PropTypes.string,
  url: PropTypes.string,
  file: PropTypes.object,
  dimensions: PropTypes.array,
  showControls: PropTypes.bool,
  showAxes: PropTypes.bool,
  className: PropTypes.string
}; */

export { MolstarViewer }