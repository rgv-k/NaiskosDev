import Hyperspeed from "@/components/Hyperspeed";

function App() {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      
      {/* Layer 1: The 3D Animation */}
      <div className="absolute inset-0 z-0">
        <Hyperspeed 
          effectOptions={{
            onSpeedUp: () => { },
            onSlowDown: () => { },
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 4,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.03, 400 * 0.2],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0x131318,
              brokenLines: 0x131318,
              leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
              rightCars: [0x03B3C2, 0x03B3C2, 0x03B3C2],
              sticks: 0x03B3C2,
            }
          }}
        />
      </div>

      {/* Layer 2: Your Content (Click-through enabled) */}
      <div className="relative z-10 flex h-full items-center justify-center pointer-events-none">
        <h1 className="text-6xl md:text-9xl font-bold text-white mix-blend-difference">
          NaiskosDev
        </h1>
      </div>

    </div>
  );
}

export default App;