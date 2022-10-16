import useResizeObserver from "../../hooks";
import mapjson from "../../assets/gadm41_ESP_TOPO.json";
import { useState, useEffect, useRef } from "react";
import { select, geoPath, geoMercator } from "d3";
import * as topojson from "topojson";
import "./Map.css";

const Map = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(topojson.feature(mapjson, mapjson.objects.gadm41_ESP_1));
  }, []);

  useEffect(() => {
    if (!data) return;
    if (!dimensions) return;

    const { width, height } = dimensions;

    const svg = select(svgRef.current);

    const projection = geoMercator()
      .fitSize([width, height], data)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .attr("class", "country")
      .transition()
      .duration(500)
      .attr("d", (feature) => pathGenerator(feature))
      .attr("fill", "gray")
      .attr("stroke", "white");
  }, [data, dimensions]);

  const viewBoxCoords = ({ width, height }) => {
    const coefs = [0.3, 0, 0.8, 0.6];
    return `
          ${width * coefs[0]} 
          ${height * coefs[1]} 
          ${width * coefs[2]} 
          ${height * coefs[3]}
    `;
  };

  return (
    <div
      ref={wrapperRef}
      style={{ marginBottom: "2rem" }}
      className="mapWrapper"
    >
      {dimensions ? (
        <svg
          className="mapCanvas"
          ref={svgRef}
          viewBox={viewBoxCoords(dimensions)}
        ></svg>
      ) : (
        <p>loading....</p>
      )}
    </div>
  );
};

export default Map;
