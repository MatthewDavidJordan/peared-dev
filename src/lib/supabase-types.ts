export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
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
          advisor_image: string | null
          advisor_name: string
          availability_id: number | null
          bio: string | null
          ical_link: string | null
          payment_info_id: number | null
          school_id: number
          user_id: string
        }
        Insert: {
          advisor_id?: number
          advisor_image?: string | null
          advisor_name: string
          availability_id?: number | null
          bio?: string | null
          ical_link?: string | null
          payment_info_id?: number | null
          school_id: number
          user_id: string
        }
        Update: {
          advisor_id?: number
          advisor_image?: string | null
          advisor_name?: string
          availability_id?: number | null
          bio?: string | null
          ical_link?: string | null
          payment_info_id?: number | null
          school_id?: number
          user_id?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          advisor_id: number | null
          availability_id: number
          conflicts: Json | null
          default_friday_schedule: Json | null
          default_monday_schedule: Json | null
          default_saturday_schedule: Json | null
          default_sunday_schedule: Json | null
          default_thursday_schedule: Json | null
          default_tuesday_schedule: Json | null
          default_wednesday_schedule: Json | null
        }
        Insert: {
          advisor_id?: number | null
          availability_id?: number
          conflicts?: Json | null
          default_friday_schedule?: Json | null
          default_monday_schedule?: Json | null
          default_saturday_schedule?: Json | null
          default_sunday_schedule?: Json | null
          default_thursday_schedule?: Json | null
          default_tuesday_schedule?: Json | null
          default_wednesday_schedule?: Json | null
        }
        Update: {
          advisor_id?: number | null
          availability_id?: number
          conflicts?: Json | null
          default_friday_schedule?: Json | null
          default_monday_schedule?: Json | null
          default_saturday_schedule?: Json | null
          default_sunday_schedule?: Json | null
          default_thursday_schedule?: Json | null
          default_tuesday_schedule?: Json | null
          default_wednesday_schedule?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "advisors"
            referencedColumns: ["advisor_id"]
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
          start_time: string
          student_id: number | null
        }
        Insert: {
          advisor_id?: number | null
          billing_receipt?: string | null
          created_at?: string | null
          end_time: string
          meeting_id?: number
          start_time: string
          student_id?: number | null
        }
        Update: {
          advisor_id?: number | null
          billing_receipt?: string | null
          created_at?: string | null
          end_time?: string
          meeting_id?: number
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
          id: string
          name: string | null
        }
        Insert: {
          email?: string
          id: string
          name?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
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
          billing_info_id: number | null
          student_id: number
          user_id: string
        }
        Insert: {
          billing_info_id?: number | null
          student_id?: number
          user_id: string
        }
        Update: {
          billing_info_id?: number | null
          student_id?: number
          user_id?: string
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
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
