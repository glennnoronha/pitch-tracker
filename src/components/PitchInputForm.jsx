import { useState } from "react";
import { supabase } from "../supabaseClient";

export function PitchInputForm() {
  const [atBats, setAtBats] = useState([]);
  const [currentAtBatId, setCurrentAtBatId] = useState(1);
  const [currentAtBatPitches, setCurrentAtBatPitches] = useState([]);

  const [formData, setFormData] = useState({
    pitchType: "",
    speed: "",
    result: "",
    location: "",
  });

  const grid = [
    ["B1", "B2", "B3", "B4", "B5"],
    ["B6", 1, 2, 3, "B7"],
    ["B8", 4, 5, 6, "B9"],
    ["B10", 7, 8, 9, "B11"],
    ["B12", "B13", "B14", "B15", "B16"],
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.pitchType ||
      !formData.speed ||
      !formData.result ||
      !formData.location
    ) {
      alert("Please fill out all fields and select a location.");
      return;
    }

    setCurrentAtBatPitches((prev) => [...prev, { ...formData }]);

    setFormData({
      pitchType: "",
      speed: "",
      result: "",
      location: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleZoneSelect = (zone) => {
    setFormData({ ...formData, location: zone });
  };

  const endAtBat = async () => {
    if (currentAtBatPitches.length === 0) {
      alert("No pitches in this at-bat.");
      return;
    }

    // 1. Insert a new at-bat
    const { data: atBat, error: atBatError } = await supabase
      .from("at_bats")
      .insert({})
      .select()
      .single();

    if (atBatError) {
      console.error("Supabase at_bat error:", atBatError.message);
      alert("Failed to save at-bat to database.");
      return;
    }

    // 2. Insert pitches for that at-bat
    const pitchInserts = currentAtBatPitches.map((pitch) => ({
      at_bat_id: atBat.id,
      pitch_type: pitch.pitchType,
      speed: pitch.speed,
      result: pitch.result,
      location: pitch.location,
    }));

    const { error: pitchError } = await supabase
      .from("pitches")
      .insert(pitchInserts);

    if (pitchError) {
      console.error("Supabase pitch insert error:", pitchError.message);
      alert("Failed to save pitches to database.");
      return;
    }

    // 3. Update UI state
    setAtBats((prev) => [
      ...prev,
      { id: atBat.id, pitches: currentAtBatPitches },
    ]);
    setCurrentAtBatPitches([]);
    setCurrentAtBatId((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-4">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="md:w-1/2 bg-gray-800 rounded shadow p-4"
      >
        <h2 className="text-white text-xl font-semibold mb-4">Pitch Input</h2>

        <select
          name="pitchType"
          value={formData.pitchType}
          onChange={handleChange}
          className=" text-white bg-gray-700 w-full p-2 border rounded mb-3 cursor-pointer"
        >
          <option className="text-white" value="">
            Select Pitch Type
          </option>
          <option className="text-white" value="fastball">
            Fastball
          </option>
          <option className="text-white" value="slider">
            Slider
          </option>
          <option className="text-white" value="curveball">
            Curveball
          </option>
          <option className="text-white" value="changeup">
            Changeup
          </option>
          <option className="text-white" value="cutter">
            Cutter
          </option>
          <option className="text-white" value="sinker">
            Sinker
          </option>
        </select>

        <input
          type="number"
          name="speed"
          placeholder="Pitch Speed (mph)"
          value={formData.speed}
          onChange={handleChange}
          className="text-white w-full p-2 border rounded mb-3"
        />

        <h3 className="text-white text-lg font-medium mb-2 text-center">
          Select Location (Catcher View)
        </h3>

        <div className="grid grid-cols-5 w-fit mx-auto mb-5">
          {grid.flat().map((cell) => {
            const isStrike = typeof cell === "number";
            const isSelected = formData.location === cell;

            return (
              <button
                type="button"
                key={cell}
                onClick={() => handleZoneSelect(cell)}
                className={`w-12 h-12 border text-sm font-medium ${
                  isSelected
                    ? "bg-gray-800 text-white"
                    : isStrike
                    ? "bg-gray-500 hover:bg-gray-200 cursor-pointer"
                    : "bg-red-400 hover:bg-red-200 cursor-pointer"
                }`}
              >
                {isStrike ? cell : ""}
              </button>
            );
          })}
        </div>

        <select
          name="result"
          value={formData.result}
          onChange={handleChange}
          className="text-white bg-gray-700 w-full p-2 border rounded mb-4 cursor-pointer"
        >
          <option className="text-white" value="">
            Select Result
          </option>
          <option className="text-white" value="Strike Looking">
            Strike Looking
          </option>
          <option className="text-white" value="Swing and Miss">
            Swing and Miss
          </option>
          <option className="text-white" value="Foul Ball">
            Foul Ball
          </option>
          <option className="text-white" value="In Play - Ground Out">
            Ground Ball Out
          </option>
          <option className="text-white" value="In Play - Fly Out">
            Fly Ball Out
          </option>
          <option className="text-white" value="In Play - Line Out">
            Line Out
          </option>
          <option className="text-white" value="In Play - Pop Out">
            Pop Out
          </option>
          <option className="text-white" value="In Play - Single">
            Single
          </option>
          <option className="text-white" value="In Play - Double">
            Double
          </option>
          <option className="text-white" value="In Play - Triple">
            Triple
          </option>
          <option className="text-white" value="In Play - Home Run">
            Home Run
          </option>
          <option className="text-white" value="Ball">
            Ball
          </option>
          <option className="text-white" value="Hit By Pitch">
            Hit By Pitch
          </option>
          <option className="text-white" value="Foul Tip">
            Foul Tip
          </option>
          <option className="text-white" value="Bunt Attempt">
            Bunt Attempt
          </option>
          <option className="text-white" value="Bunt Foul">
            Bunt Foul
          </option>
          <option className="text-white" value="Bunt Hit">
            Bunt Hit
          </option>
          <option className="text-white" value="Dropped Third Strike">
            Dropped Third Strike
          </option>
          <option className="text-white" value="Catcher's Interference">
            Catcher's Interference
          </option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-600 cursor-pointer"
        >
          Submit Pitch
        </button>

        <button
          type="button"
          onClick={endAtBat}
          className="w-full bg-red-500 text-white py-3 rounded mt-2 hover:bg-red-400 cursor-pointer"
        >
          End At-Bat
        </button>
      </form>

      {/* Log Section */}
      <div className="md:w-1/2 bg-gray-800 rounded shadow p-4">
        {currentAtBatPitches.length > 0 && (
          <div className="mb-10">
            <h3 className="text-white text-lg font-semibold mb-2">
              Current At-Bat #{currentAtBatId}
            </h3>
            <table className="w-full table-auto border border-collapse text-sm">
              <thead>
                <tr className="bg-gray-600 text-center">
                  <th className="text-white border px-2 py-1">#</th>
                  <th className="text-white border px-2 py-1">Type</th>
                  <th className="text-white border px-2 py-1">Speed</th>
                  <th className="text-white border px-2 py-1">Result</th>
                  <th className="text-white border px-2 py-1">Location</th>
                </tr>
              </thead>
              <tbody>
                {currentAtBatPitches.map((pitch, index) => (
                  <tr key={index} className="even:bg-gray-50">
                    <td className="text-white text-center border px-2 py-1">{index + 1}</td>
                    <td className="text-white text-center border px-2 py-1">{pitch.pitchType}</td>
                    <td className="text-white text-center border px-2 py-1">{pitch.speed} mph</td>
                    <td className="text-white text-center border px-2 py-1">{pitch.result}</td>
                    <td className="text-white text-center border px-2 py-1">{pitch.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {atBats.length > 0 && (
          <div>
            <h3 className="text-white text-xl font-bold mb-4">
              Completed At-Bats
            </h3>
            {atBats.map((ab) => (
              <div key={ab.id} className="mb-6">
                <h4 className="text-white font-semibold mb-2">
                  At-Bat #{ab.id}
                </h4>
                <table className="w-full table-auto border border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-600 text-center">
                      <th className="text-white border px-2 py-1">#</th>
                      <th className="text-white border px-2 py-1">Type</th>
                      <th className="text-white border px-2 py-1">Speed</th>
                      <th className="text-white border px-2 py-1">Result</th>
                      <th className="text-white border px-2 py-1">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ab.pitches.map((pitch, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="text-white text-center border px-2 py-1">
                          {index + 1}
                        </td>
                        <td className="text-white text-center border px-2 py-1">
                          {pitch.pitchType}
                        </td>
                        <td className="text-white text-center border px-2 py-1">
                          {pitch.speed} mph
                        </td>
                        <td className="text-white text-center border px-2 py-1">
                          {pitch.result}
                        </td>
                        <td className="text-white text-center border px-2 py-1">
                          {pitch.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
