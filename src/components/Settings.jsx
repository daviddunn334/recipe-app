import { useState } from 'react'

function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-base-content/70 mt-2">
          Customize your application settings
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Appearance</h2>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Theme</span>
            </label>
            <select 
              className="select select-bordered"
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="cupcake">Cupcake</option>
              <option value="bumblebee">Bumblebee</option>
              <option value="emerald">Emerald</option>
              <option value="corporate">Corporate</option>
              <option value="synthwave">Synthwave</option>
              <option value="retro">Retro</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="valentine">Valentine</option>
              <option value="halloween">Halloween</option>
              <option value="garden">Garden</option>
              <option value="forest">Forest</option>
              <option value="aqua">Aqua</option>
              <option value="lofi">Lofi</option>
              <option value="pastel">Pastel</option>
              <option value="fantasy">Fantasy</option>
              <option value="wireframe">Wireframe</option>
              <option value="black">Black</option>
              <option value="luxury">Luxury</option>
              <option value="dracula">Dracula</option>
              <option value="cmyk">CMYK</option>
              <option value="autumn">Autumn</option>
              <option value="business">Business</option>
              <option value="acid">Acid</option>
              <option value="lemonade">Lemonade</option>
              <option value="night">Night</option>
              <option value="coffee">Coffee</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 