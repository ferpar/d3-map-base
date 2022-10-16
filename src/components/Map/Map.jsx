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
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    setGeoData(topojson.feature(mapjson, mapjson.objects.gadm41_ESP_1));
  }, []);

  useEffect(() => {
    if (!geoData) return;
    if (!dimensions) return;

    const { width, height } = dimensions;

    const svg = select(svgRef.current);

    const projection = geoMercator()
      .fitSize([width, height], geoData)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    const regions = svg
      .selectAll(".administrative-region")
      .data(geoData.features)
      .join("path")
      .attr("class", "administrative-region")
      .attr("d", (feature) => pathGenerator(feature))
      .attr("fill", "gray")
      .attr("stroke", "white")
      .on("mouseover", function (event, d) {
        select(this).attr("fill", "red");
      })
      .on("mouseout", function (event, d) {
        select(this).attr("fill", "gray");
      });

    console.log(regions);
  }, [geoData, dimensions]);

  // function to
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
      style={{ marginBottom: "2rem", transform: "skewX(-10deg)" }}
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
