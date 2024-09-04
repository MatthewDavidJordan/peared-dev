import { Advisor, AdvisorArtsGroup, AdvisorClubSport, AdvisorConcentration, AdvisorEthnicity, AdvisorFraternity, AdvisorLanguage, AdvisorMajor, AdvisorMinor, AdvisorPreProfessionalClub, AdvisorRace, AdvisorRecreationalClub, AdvisorReligion, AdvisorSorority, AdvisorVarsitySport, AdvisorWithRelations, FullAdvisor, School } from "@/models";
import { getDbClient } from "@/utils/supabase/client";

export async function loadSchools(): Promise<School[]> {
  const supabase_client = await getDbClient();

  const getAllSchoolsQuery = supabase_client
  .from('schools')
  .select('*');

  const { data: schools, error } = await getAllSchoolsQuery;

  if (error) {
    console.error('Error fetching schools:', error);
    return [];
  }

  return schools ?? [];
}

// load all advisors for a school
// export async function loadAdvisorsBySchoolId(school_id: string): Promise<FullAdvisor[]> {
//   const supabase_client = await getDbClient();

//   const getAllAdvisorsQuery = supabase_client
//   .from('advisors')
//   .select('*')
//   .eq('school_id', school_id);

//   const { data: advisors, error } = await getAllAdvisorsQuery;

//   if (error) {
//     console.error('Error fetching advisors:', error);
//     return [];
//   }

//   return advisors ?? [];
// }

export async function loadAdvisorsBySchoolId(school_id: string): Promise<FullAdvisor[]> {
  const supabase_client = await getDbClient();

  const getAllAdvisorsQuery = supabase_client
    .from('advisors')
    .select(`
      *,
      advisor_majors (
        majors (*)
      ),
      advisor_minors (
        minors (*)
      ),
      advisor_concentrations (
        concentrations (*)
      ),
      advisor_varsity_sports (
        varsity_sports (*)
      ),
      advisor_club_sports (
        club_sports (*)
      ),
      advisor_pre_professional_clubs (
        pre_professional_clubs (*)
      ),
      advisor_recreational_clubs (
        recreational_clubs (*)
      ),
      advisor_fraternities (
        fraternities (*)
      ),
      advisor_sororities (
        sororities (*)
      ),
      advisor_arts_groups (
        arts_groups (*)
      ),
      advisor_races (
        races (*)
      ),
      advisor_ethnicities (
        ethnicities (*)
      ),
      advisor_religions (
        religions (*)
      ),
      advisor_languages (
        languages (*)
      )
    `)
    .eq('school_id', school_id);

  const { data: advisors, error } = await getAllAdvisorsQuery;

  if (error) {
    console.error('Error fetching advisors:', error);
    return [];
  }

  const fullAdvisors: FullAdvisor[] = (advisors as AdvisorWithRelations[])?.map(advisor => ({
    ...advisor,
    majors: advisor.advisor_majors?.map((am: AdvisorMajor) => am.majors) || null,
    minors: advisor.advisor_minors?.map((am: AdvisorMinor) => am.minors) || null,
    concentrations: advisor.advisor_concentrations?.map((ac: AdvisorConcentration) => ac.concentrations) || null,
    varsity_sports: advisor.advisor_varsity_sports?.map((avs: AdvisorVarsitySport) => avs.varsity_sports) || null,
    club_sports: advisor.advisor_club_sports?.map((acs: AdvisorClubSport) => acs.club_sports) || null,
    pre_professional_clubs: advisor.advisor_pre_professional_clubs?.map((appc: AdvisorPreProfessionalClub) => appc.pre_professional_clubs) || null,
    recreational_clubs: advisor.advisor_recreational_clubs?.map((arc: AdvisorRecreationalClub) => arc.recreational_clubs) || null,
    fraternities: advisor.advisor_fraternities?.map((af: AdvisorFraternity) => af.fraternities) || null,
    sororities: advisor.advisor_sororities?.map((as: AdvisorSorority) => as.sororities) || null,
    arts_groups: advisor.advisor_arts_groups?.map((aag: AdvisorArtsGroup) => aag.arts_groups) || null,
    races: advisor.advisor_races?.map((ar: AdvisorRace) => ar.races) || null,
    ethnicities: advisor.advisor_ethnicities?.map((ae: AdvisorEthnicity) => ae.ethnicities) || null,
    religions: advisor.advisor_religions?.map((ar: AdvisorReligion) => ar.religions) || null,
    languages: advisor.advisor_languages?.map((al: AdvisorLanguage) => al.languages) || null,
  })) || [];

  return fullAdvisors;
}

export async function getCalendlyUrlFromAdvisorId(advisor_id: string) {
  const supabase_client = await getDbClient();

  const getAdvisorQuery = supabase_client
  .from('advisors')
  .select('calendly_url')
  .eq('id', advisor_id);

  const { data: advisor, error } = await getAdvisorQuery;

  if (error) {
    console.error('Error fetching advisor:', error);
    return '';
  }

  return advisor[0].calendly_url;
}

// export async function loadCat(id: string) {
//   const query = "SELECT * FROM cats WHERE id = $1 LIMIT 1";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [id]);

//   const cat = result.rows[0];

//   if (!cat) {
//     throw Error("Here kitty kitty! Cannot find cat " + id);
//   }

//   return cat;
// }

// export async function insertCat(cat: Omit<Cat, "id">) {
//   const query =
//     "INSERT INTO cats(id, name, color) VALUES($1, $2, $3) RETURNING *";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [
//     randomUUID(),
//     cat.name,
//     cat.color,
//   ]);

//   return result.rows[0];
// }

// export async function updateCat(cat: Cat) {
//   const query =
//     "UPDATE cats SET name = $1, color = $2, tags = $3 WHERE id = $4 RETURNING *";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [
//     cat.name,
//     cat.color,
//     cat.tags,
//     cat.id,
//   ]);

//   return result.rows[0];
// }

// export async function deleteCat(id: string) {
//   const query = "DELETE FROM cats WHERE id = $1 RETURNING *";
//   const client = await getDbClient();
//   const result = await client.query<Cat>(query, [id]);

//   return result.rows[0];
// }

// export async function loadDogs() {
//   const client = await getDbClient();
//   const result = await client.query<Dog>("SELECT * FROM dogs ORDER BY name");

//   return result.rows;
// }
