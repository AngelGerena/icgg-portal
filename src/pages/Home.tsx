import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import HomeTeasers from '../components/HomeTeasers';
import HomeEvents from '../components/HomeEvents';
import GivingCTA from '../components/GivingCTA';

const Home = () => (
  <>
    <Hero />
    <About />
    <Services />
    <HomeTeasers />
    <HomeEvents />
    <GivingCTA />
  </>
);

export default Home;
