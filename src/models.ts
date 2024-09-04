import { Tables } from '@/database/database.types';

// base table types
export type School = Tables<'schools'>;

export type Advisor = Tables<'advisors'>;

// lookup table types
export type Major = Tables<'majors'>;
export type Minor = Tables<'minors'>;
export type Concentration = Tables<'concentrations'>;
export type VarsitySport = Tables<'varsity_sports'>;
export type ClubSport = Tables<'club_sports'>;
export type PreProfessionalClub = Tables<'pre_professional_clubs'>;
export type RecreationalClub = Tables<'recreational_clubs'>;
export type Fraternity = Tables<'fraternities'>;
export type Sorority = Tables<'sororities'>;
export type ArtsGroup = Tables<'arts_groups'>;
export type Race = Tables<'races'>;
export type Ethnicity = Tables<'ethnicities'>;
export type Religion = Tables<'religions'>;
export type Language = Tables<'languages'>;

// full advisor type: advisor + lookup tables
export type FullAdvisor = Advisor & {
    majors: Major[] | null;
    minors: Minor[] | null;
    concentrations: Concentration[] | null;
    varsity_sports: VarsitySport[] | null;
    club_sports: ClubSport[] | null;
    pre_professional_clubs: PreProfessionalClub[] | null;
    recreational_clubs: RecreationalClub[] | null;
    fraternities: Fraternity[] | null;
    sororities: Sorority[] | null;
    arts_groups: ArtsGroup[] | null;
    races: Race[] | null;
    ethnicities: Ethnicity[] | null;
    religions: Religion[] | null;
    languages: Language[] | null;
};

export type AdvisorMajor = {
    majors: Major
  }
  
export type AdvisorMinor = {
    minors: Minor
}

export type AdvisorConcentration = {
    concentrations: Concentration
}

export type AdvisorVarsitySport = {
    varsity_sports: VarsitySport
}

export type AdvisorClubSport = {
    club_sports: ClubSport
}

export type AdvisorPreProfessionalClub = {
    pre_professional_clubs: PreProfessionalClub
}

export type AdvisorRecreationalClub = {
    recreational_clubs: RecreationalClub
}

export type AdvisorFraternity = {
    fraternities: Fraternity
}

export type AdvisorSorority = {
    sororities: Sorority
}

export type AdvisorArtsGroup = {
    arts_groups: ArtsGroup
}

export type AdvisorRace = {
    races: Race
}

export type AdvisorEthnicity = {
    ethnicities: Ethnicity
}

export type AdvisorReligion = {
    religions: Religion
}

export type AdvisorLanguage = {
    languages: Language
}

export type AdvisorWithRelations = Advisor & {
    advisor_majors: AdvisorMajor[] | null
    advisor_minors: AdvisorMinor[] | null
    advisor_concentrations: AdvisorConcentration[] | null
    advisor_varsity_sports: AdvisorVarsitySport[] | null
    advisor_club_sports: AdvisorClubSport[] | null
    advisor_pre_professional_clubs: AdvisorPreProfessionalClub[] | null
    advisor_recreational_clubs: AdvisorRecreationalClub[] | null
    advisor_fraternities: AdvisorFraternity[] | null
    advisor_sororities: AdvisorSorority[] | null
    advisor_arts_groups: AdvisorArtsGroup[] | null
    advisor_races: AdvisorRace[] | null
    advisor_ethnicities: AdvisorEthnicity[] | null
    advisor_religions: AdvisorReligion[] | null
    advisor_languages: AdvisorLanguage[] | null
}