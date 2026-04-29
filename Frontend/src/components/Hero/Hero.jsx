import { useContext } from 'react'
import './Hero.css'
import { StoreContext } from '../context/StoreContext'

const Hero = () => {
  const { token,userProfile} = useContext(StoreContext);
  console.log(userProfile)
  return (
    <>
    <div className="hero">
        <div className="hero-section">
          <div className="hero-left">
            <div className="hero-title">{ token && userProfile ? 
            `Welcome ${userProfile.name},` :`Welcome to Umess,`
            }</div>
            <div className="hero-description">
              Umess is a streamlined digital platform that replaces traditional mess cards with QR code-based meal access. Students simply scan their unique QR code for each meal, tracking meal availability in real-time. The system ensures each meal can be availed once per time slot, saving hassle and reducing waste.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero