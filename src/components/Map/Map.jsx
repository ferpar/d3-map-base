import useResizeObserver from "../../hooks";
import autonomusRegions from "../../assets/gadm41_ESP_TOPO.json";
import provinces from "../../assets/gadm41_ESP_2_TOPO.json";
import { useState, useEffect, useRef } from "react";
import { select, geoPath, geoMercator, transition } from "d3";
import * as topojson from "topojson";
import "./Map.css";

const Map = () => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    setGeoData(topojson.feature(provinces, provinces.objects.adminRegions));
  }, []);

  useEffect(() => {
    if (!geoData) return;
    if (!dimensions) return;

    const { width, height } = dimensions;

    const svg = select(svgRef.current);

    const regionContainer = svg
      .selectAll(".regionContainer")
      .data(["region container"])
      .join("g")
      .attr("class", "regionContainer");

    const overlayRegionContainer = svg
      .selectAll(".overlayRegionContainer")
      .data(["overlay region container"])
      .join("g")
      .attr("class", "overlayRegionContainer");

    const projection = geoMercator()
      .fitSize([width, height], geoData)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    console.log(geoData);

    const regions = regionContainer
      .selectAll(".administrativeRegion")
      .data(geoData.features)
      .join("path")
      .attr(
        "class",
        (feature) => `administrativeRegion ${feature.properties.NAME_2}`
      )
      .attr("d", (feature) => pathGenerator(feature))
      .attr("fill", "gray")
      .attr("stroke", "white");

    const overlayRegions = overlayRegionContainer
      .selectAll(".overlayRegion")
      .data(geoData.features)
      .join("path")
      .attr("class", "overlayRegion")
      .attr("d", (feature) => pathGenerator(feature))
      .attr("fill", "transparent")
      .attr("stroke", "transparent")
      .on("mouseover", function (event, d) {
        const thisRegion = window.document.querySelector(
          `.${d.properties.NAME_2}`
        );
        window.document
          .querySelector(".regionContainer")
          .appendChild(thisRegion);
        select(`.${d.properties.NAME_2}`)
          .style("fill", "green")
          .transition(500)
          .style("transform", "translateX(-10px)");
      })
      .on("mouseout", function (event, d) {
        select(`.${d.properties.NAME_2}`)
          .style("fill", "gray")
          .transition(500)
          .style("transform", "translateX(0px)");
      });
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
