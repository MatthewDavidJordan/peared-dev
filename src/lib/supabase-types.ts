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
      advisor_labels: {
        Row: {
          advisor_id: number | null
          advisor_label_id: number
          label_id: number | null
        }
        Insert: {
          advisor_id?: number | null
          advisor_label_id?: number
          label_id?: number | null
        }
        Update: {
          advisor_id?: number | null
          advisor_label_id?: number
          label_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_labels_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["advisor_id"]
          },
          {
            foreignKeyName: "advisor_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["label_id"]
          },
        ]
      }
      advisors: {
        Row: {
          advisor_id: number
          advisor_image: string
          bio: string
          ical_link: string
          profile_id: number
          school_id: number
        }
        Insert: {
          advisor_id?: number
          advisor_image: string
          bio: string
          ical_link: string
          profile_id: number
          school_id: number
        }
        Update: {
          advisor_id?: number
          advisor_image?: string
          bio?: string
          ical_link?: string
          profile_id?: number
          school_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "advisors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_info: {
        Row: {
          billing_data: Json | null
          billing_info_id: number
          student_id: number | null
        }
        Insert: {
          billing_data?: Json | null
          billing_info_id?: number
          student_id?: number | null
        }
        Update: {
          billing_data?: Json | null
          billing_info_id?: number
          student_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_info_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      billing_receipts: {
        Row: {
          billing_info: Json | null
          billing_receipt_id: number
          meeting_id: number | null
        }
        Insert: {
          billing_info?: Json | null
          billing_receipt_id?: number
          meeting_id?: number | null
        }
        Update: {
          billing_info?: Json | null
          billing_receipt_id?: number
          meeting_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_receipts_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["meeting_id"]
          },
        ]
      }
      labels: {
        Row: {
          category_name: string
          label_id: number
          label_name: string
        }
        Insert: {
          category_name: string
          label_id?: number
          label_name: string
        }
        Update: {
          category_name?: string
          label_id?: number
          label_name?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          advisor_id: number | null
          billing_receipt: string | null
          created_at: string | null
          end_time: string
          meeting_id: number
          meeting_url: string | null
          start_time: string
          student_id: number | null
        }
        Insert: {
          advisor_id?: number | null
          billing_receipt?: string | null
          created_at?: string | null
          end_time: string
          meeting_id?: number
          meeting_url?: string | null
          start_time: string
          student_id?: number | null
        }
        Update: {
          advisor_id?: number | null
          billing_receipt?: string | null
          created_at?: string | null
          end_time?: string
          meeting_id?: number
          meeting_url?: string | null
          start_time?: string
          student_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["advisor_id"]
          },
          {
            foreignKeyName: "meetings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      payment_info: {
        Row: {
          advisor_id: number | null
          payment_data: Json | null
          payment_info_id: number
        }
        Insert: {
          advisor_id?: number | null
          payment_data?: Json | null
          payment_info_id?: number
        }
        Update: {
          advisor_id?: number | null
          payment_data?: Json | null
          payment_info_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_info_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["advisor_id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string
          first_name: string
          id: number
          last_name: string
          user_id: string
        }
        Insert: {
          email: string
          first_name: string
          id?: number
          last_name: string
          user_id?: string
        }
        Update: {
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          advisor_id: number | null
          created_at: string | null
          rating: number | null
          rating_id: number
          student_id: number | null
        }
        Insert: {
          advisor_id?: number | null
          created_at?: string | null
          rating?: number | null
          rating_id?: number
          student_id?: number | null
        }
        Update: {
          advisor_id?: number | null
          created_at?: string | null
          rating?: number | null
          rating_id?: number
          student_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["advisor_id"]
          },
          {
            foreignKeyName: "ratings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      schools: {
        Row: {
          school_id: number
          school_image: string | null
          school_name: string
        }
        Insert: {
          school_id?: number
          school_image?: string | null
          school_name: string
        }
        Update: {
          school_id?: number
          school_image?: string | null
          school_name?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          completed_sign_up_form: boolean
          extracurriculars: string | null
          graduation_year: number | null
          high_school: string | null
          major: string | null
          profile_id: number | null
          student_id: number
        }
        Insert: {
          completed_sign_up_form?: boolean
          extracurriculars?: string | null
          graduation_year?: number | null
          high_school?: string | null
          major?: string | null
          profile_id?: number | null
          student_id?: number
        }
        Update: {
          completed_sign_up_form?: boolean
          extracurriculars?: string | null
          graduation_year?: number | null
          high_school?: string | null
          major?: string | null
          profile_id?: number | null
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      religion:
        | "Christianity"
        | "Islam"
        | "Hinduism"
        | "Buddhism"
        | "Sikhism"
        | "Judaism"
        | "Baháʼí Faith"
        | "Jainism"
        | "Shinto"
        | "Zoroastrianism"
        | "Taoism"
        | "Confucianism"
        | "Spiritism"
        | "Tenrikyo"
        | "Rastafari"
        | "Animism"
        | "Neo-Paganism"
        | "Unitarian Universalism"
        | "Atheism"
        | "Agnosticism"
        | "Humanism"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
