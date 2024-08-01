export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      advisor_arts_groups: {
        Row: {
          advisor_id: string
          arts_group_id: string
          id: string
        }
        Insert: {
          advisor_id: string
          arts_group_id: string
          id?: string
        }
        Update: {
          advisor_id?: string
          arts_group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_arts_groups_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_arts_groups_arts_group_id_fkey"
            columns: ["arts_group_id"]
            isOneToOne: false
            referencedRelation: "arts_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_club_sports: {
        Row: {
          advisor_id: string
          club_sport_id: string
          id: string
        }
        Insert: {
          advisor_id: string
          club_sport_id: string
          id?: string
        }
        Update: {
          advisor_id?: string
          club_sport_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_club_sports_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_club_sports_club_sport_id_fkey"
            columns: ["club_sport_id"]
            isOneToOne: false
            referencedRelation: "club_sports"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_concentrations: {
        Row: {
          advisor_id: string
          concentration_id: string
          id: string
        }
        Insert: {
          advisor_id: string
          concentration_id: string
          id?: string
        }
        Update: {
          advisor_id?: string
          concentration_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_concentrations_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_concentrations_concentration_id_fkey"
            columns: ["concentration_id"]
            isOneToOne: false
            referencedRelation: "concentrations"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_ethnicities: {
        Row: {
          advisor_id: string
          ethnicity_id: string
          id: string
        }
        Insert: {
          advisor_id: string
          ethnicity_id: string
          id?: string
        }
        Update: {
          advisor_id?: string
          ethnicity_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_ethnicities_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_ethnicities_ethnicity_id_fkey"
            columns: ["ethnicity_id"]
            isOneToOne: false
            referencedRelation: "ethnicities"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_languages: {
        Row: {
          advisor_id: string
          id: string
          language_id: string
        }
        Insert: {
          advisor_id: string
          id?: string
          language_id: string
        }
        Update: {
          advisor_id?: string
          id?: string
          language_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_languages_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_majors: {
        Row: {
          advisor_id: string
          id: string
          major_id: string
        }
        Insert: {
          advisor_id: string
          id?: string
          major_id: string
        }
        Update: {
          advisor_id?: string
          id?: string
          major_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_majors_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_majors_major_id_fkey"
            columns: ["major_id"]
            isOneToOne: false
            referencedRelation: "majors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_minors: {
        Row: {
          advisor_id: string
          id: string
          minor_id: string
        }
        Insert: {
          advisor_id: string
          id?: string
          minor_id: string
        }
        Update: {
          advisor_id?: string
          id?: string
          minor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_minors_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_minors_minor_id_fkey"
            columns: ["minor_id"]
            isOneToOne: false
            referencedRelation: "minors"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_pre_professional_clubs: {
        Row: {
          advisor_id: string
          id: string
          pre_professional_club_id: string
        }
        Insert: {
          advisor_id: string
          id?: string
          pre_professional_club_id: string
        }
        Update: {
          advisor_id?: string
          id?: string
          pre_professional_club_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_pre_professional_clubs_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_pre_professional_clubs_pre_professional_club_id_fkey"
            columns: ["pre_professional_club_id"]
            isOneToOne: false
            referencedRelation: "pre_professional_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_races: {
        Row: {
          advisor_id: string
          id: string
          race_id: string
        }
        Insert: {
          advisor_id: string
          id?: string
          race_id: string
        }
        Update: {
          advisor_id?: string
          id?: string
          race_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_races_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_races_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_recreational_clubs: {
        Row: {
          advisor_id: string
          id: string
          recreational_club_id: string
        }
        Insert: {
          advisor_id: string
          id?: string
          recreational_club_id: string
        }
        Update: {
          advisor_id?: string
          id?: string
          recreational_club_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_recreational_clubs_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_recreational_clubs_recreational_club_id_fkey"
            columns: ["recreational_club_id"]
            isOneToOne: false
            referencedRelation: "recreational_clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_varsity_sports: {
        Row: {
          advisor_id: string
          id: string
          varsity_sport_id: string
        }
        Insert: {
          advisor_id: string
          id?: string
          varsity_sport_id: string
        }
        Update: {
          advisor_id?: string
          id?: string
          varsity_sport_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_varsity_sports_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advisor_varsity_sports_varsity_sport_id_fkey"
            columns: ["varsity_sport_id"]
            isOneToOne: false
            referencedRelation: "varsity_sports"
            referencedColumns: ["id"]
          },
        ]
      }
      advisors: {
        Row: {
          bio: string | null
          birthdate: string | null
          calendly_url: string | null
          college_grad_month: number | null
          college_grad_year: number | null
          email: string
          first_name: string
          gender: string | null
          high_school: string | null
          home_state: string | null
          hometown: string | null
          id: string
          image_url: string | null
          last_name: string
          linkedin_link: string | null
          personal_website_link: string | null
          phone: string | null
          school_id: string | null
          sex: string | null
        }
        Insert: {
          bio?: string | null
          birthdate?: string | null
          calendly_url?: string | null
          college_grad_month?: number | null
          college_grad_year?: number | null
          email: string
          first_name: string
          gender?: string | null
          high_school?: string | null
          home_state?: string | null
          hometown?: string | null
          id?: string
          image_url?: string | null
          last_name: string
          linkedin_link?: string | null
          personal_website_link?: string | null
          phone?: string | null
          school_id?: string | null
          sex?: string | null
        }
        Update: {
          bio?: string | null
          birthdate?: string | null
          calendly_url?: string | null
          college_grad_month?: number | null
          college_grad_year?: number | null
          email?: string
          first_name?: string
          gender?: string | null
          high_school?: string | null
          home_state?: string | null
          hometown?: string | null
          id?: string
          image_url?: string | null
          last_name?: string
          linkedin_link?: string | null
          personal_website_link?: string | null
          phone?: string | null
          school_id?: string | null
          sex?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisors_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      arts_groups: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      club_sports: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      concentrations: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      ethnicities: {
        Row: {
          ethnicity: Database["public"]["Enums"]["ethnicity"]
          id: string
        }
        Insert: {
          ethnicity: Database["public"]["Enums"]["ethnicity"]
          id?: string
        }
        Update: {
          ethnicity?: Database["public"]["Enums"]["ethnicity"]
          id?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          id: string
          language: Database["public"]["Enums"]["language"]
        }
        Insert: {
          id?: string
          language: Database["public"]["Enums"]["language"]
        }
        Update: {
          id?: string
          language?: Database["public"]["Enums"]["language"]
        }
        Relationships: []
      }
      majors: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      minors: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      pre_professional_clubs: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      races: {
        Row: {
          id: string
          race: Database["public"]["Enums"]["race"]
        }
        Insert: {
          id?: string
          race: Database["public"]["Enums"]["race"]
        }
        Update: {
          id?: string
          race?: Database["public"]["Enums"]["race"]
        }
        Relationships: []
      }
      recreational_clubs: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          color_hex_code: string
          disabled: boolean
          id: string
          name: string
        }
        Insert: {
          color_hex_code: string
          disabled: boolean
          id?: string
          name: string
        }
        Update: {
          color_hex_code?: string
          disabled?: boolean
          id?: string
          name?: string
        }
        Relationships: []
      }
      varsity_sports: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ethnicity: "Hispanic or Latino" | "Not Hispanic or Latino" | "Other"
      language:
        | "English"
        | "Spanish"
        | "Chinese"
        | "Hindi"
        | "Arabic"
        | "Portuguese"
        | "Bengali"
        | "Russian"
        | "Japanese"
        | "German"
        | "French"
        | "Korean"
        | "Italian"
        | "Dutch"
        | "Turkish"
        | "Vietnamese"
        | "Polish"
        | "Hebrew"
        | "Swedish"
        | "Norwegian"
        | "Danish"
        | "Finnish"
        | "Greek"
        | "Thai"
        | "Czech"
        | "Hungarian"
        | "Romanian"
        | "Slovak"
        | "Croatian"
        | "Serbian"
        | "Bulgarian"
        | "Ukrainian"
        | "Persian"
        | "Malay"
        | "Indonesian"
        | "Filipino"
        | "Other"
      race:
        | "American Indian or Alaska Native"
        | "Asian"
        | "Black or African American"
        | "Native Hawaiian or Other Pacific Islander"
        | "White"
        | "Other"
      sex: "Male" | "Female" | "Other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
