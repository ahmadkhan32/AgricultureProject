import { supabase } from '../config/supabase';
import { sampleNewsData } from './sampleNewsData';
import { sampleProducersData } from './sampleProducersData';
import { samplePartnershipsData } from './samplePartnershipsData';
import { sampleResourcesData } from './sampleResourcesData';

export const populateNewsData = async () => {
  try {
    console.log('Starting to populate news data...');
    
    // Check if news data already exists
    const { data: existingNews, error: checkError } = await supabase
      .from('news')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing news:', checkError);
      return;
    }
    
    if (existingNews && existingNews.length > 0) {
      console.log('News data already exists, skipping population.');
      return;
    }
    
    // Insert sample news data
    const { data, error } = await supabase
      .from('news')
      .insert(sampleNewsData);
    
    if (error) {
      console.error('Error inserting news data:', error);
      return;
    }
    
    console.log('Successfully populated news data:', data);
    return data;
  } catch (error) {
    console.error('Error in populateNewsData:', error);
  }
};

export const populateProducersData = async () => {
  try {
    console.log('Starting to populate producers data...');
    
    // Check if producers data already exists
    const { data: existingProducers, error: checkError } = await supabase
      .from('producers')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing producers:', checkError);
      return;
    }
    
    if (existingProducers && existingProducers.length > 0) {
      console.log('Producers data already exists, skipping population.');
      return;
    }
    
    // Insert sample producers data
    const { data, error } = await supabase
      .from('producers')
      .insert(sampleProducersData);
    
    if (error) {
      console.error('Error inserting producers data:', error);
      return;
    }
    
    console.log('Successfully populated producers data:', data);
    return data;
  } catch (error) {
    console.error('Error in populateProducersData:', error);
  }
};

export const populatePartnershipsData = async () => {
  try {
    console.log('Starting to populate partnerships data...');
    
    // Check if partnerships data already exists
    const { data: existingPartnerships, error: checkError } = await supabase
      .from('partnerships')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing partnerships:', checkError);
      return;
    }
    
    if (existingPartnerships && existingPartnerships.length > 0) {
      console.log('Partnerships data already exists, skipping population.');
      return;
    }
    
    // Insert sample partnerships data
    const { data, error } = await supabase
      .from('partnerships')
      .insert(samplePartnershipsData);
    
    if (error) {
      console.error('Error inserting partnerships data:', error);
      return;
    }
    
    console.log('Successfully populated partnerships data:', data);
    return data;
  } catch (error) {
    console.error('Error in populatePartnershipsData:', error);
  }
};

export const populateResourcesData = async () => {
  try {
    console.log('Starting to populate resources data...');
    
    // Check if resources data already exists
    const { data: existingResources, error: checkError } = await supabase
      .from('resources')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing resources:', checkError);
      return;
    }
    
    if (existingResources && existingResources.length > 0) {
      console.log('Resources data already exists, skipping population.');
      return;
    }
    
    // Insert sample resources data
    const { data, error } = await supabase
      .from('resources')
      .insert(sampleResourcesData);
    
    if (error) {
      console.error('Error inserting resources data:', error);
      return;
    }
    
    console.log('Successfully populated resources data:', data);
    return data;
  } catch (error) {
    console.error('Error in populateResourcesData:', error);
  }
};

// Function to check and populate news data if needed
export const ensureNewsData = async () => {
  try {
    const { data: newsCount, error } = await supabase
      .from('news')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking news count:', error);
      return;
    }
    
    if (newsCount === 0) {
      console.log('No news data found, populating...');
      await populateNewsData();
    } else {
      console.log(`Found ${newsCount} news articles in database.`);
    }
  } catch (error) {
    console.error('Error in ensureNewsData:', error);
  }
};

// Function to check and populate producers data if needed
export const ensureProducersData = async () => {
  try {
    const { data: producersCount, error } = await supabase
      .from('producers')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking producers count:', error);
      return;
    }
    
    if (producersCount === 0) {
      console.log('No producers data found, populating...');
      await populateProducersData();
    } else {
      console.log(`Found ${producersCount} producers in database.`);
    }
  } catch (error) {
    console.error('Error in ensureProducersData:', error);
  }
};

// Function to check and populate partnerships data if needed
export const ensurePartnershipsData = async () => {
  try {
    const { data: partnershipsCount, error } = await supabase
      .from('partnerships')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking partnerships count:', error);
      return;
    }
    
    if (partnershipsCount === 0) {
      console.log('No partnerships data found, populating...');
      await populatePartnershipsData();
    } else {
      console.log(`Found ${partnershipsCount} partnerships in database.`);
    }
  } catch (error) {
    console.error('Error in ensurePartnershipsData:', error);
  }
};

// Function to check and populate resources data if needed
export const ensureResourcesData = async () => {
  try {
    const { data: resourcesCount, error } = await supabase
      .from('resources')
      .select('id', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking resources count:', error);
      return;
    }
    
    if (resourcesCount === 0) {
      console.log('No resources data found, populating...');
      await populateResourcesData();
    } else {
      console.log(`Found ${resourcesCount} resources in database.`);
    }
  } catch (error) {
    console.error('Error in ensureResourcesData:', error);
  }
};

// Function to ensure all sample data exists
export const ensureAllData = async () => {
  await ensureNewsData();
  await ensureProducersData();
  await ensurePartnershipsData();
  await ensureResourcesData();
};

export default populateNewsData;
