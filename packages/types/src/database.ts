export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      agent_applications: {
        Row: {
          created_at: string;
          id: number;
          rejection_reason: string | null;
          status: string;
          updated_at: string | null;
          url: string;
          user_id: string | null;
          veriff_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          rejection_reason?: string | null;
          status?: string;
          updated_at?: string | null;
          url?: string;
          user_id?: string | null;
          veriff_id?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          rejection_reason?: string | null;
          status?: string;
          updated_at?: string | null;
          url?: string;
          user_id?: string | null;
          veriff_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_applications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      amenities: {
        Row: {
          created_at: string;
          id: number;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      blocked_users: {
        Row: {
          blocked_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          blocked_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          blocked_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_id_fkey";
            columns: ["blocked_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blocked_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      chats: {
        Row: {
          created_at: string;
          id: string;
          receiver_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          receiver_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          receiver_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chats_receiver_id_fkey";
            columns: ["receiver_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      cities: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      communities: {
        Row: {
          city: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          city: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          city?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_communities_city_fkey";
            columns: ["city"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          }
        ];
      };
      favourites: {
        Row: {
          created_at: string;
          id: number;
          property_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          property_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          property_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favourites_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favourites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      lease_durations: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      listing_types: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      message_approvals: {
        Row: {
          approved: boolean | null;
          approver_id: string | null;
          chat_id: string | null;
          created_at: string;
          id: string;
        };
        Insert: {
          approved?: boolean | null;
          approver_id?: string | null;
          chat_id?: string | null;
          created_at?: string;
          id?: string;
        };
        Update: {
          approved?: boolean | null;
          approver_id?: string | null;
          chat_id?: string | null;
          created_at?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_approvals_approver_id_fkey";
            columns: ["approver_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "message_approvals_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          chat_id: string | null;
          content: string;
          content_type: Database["public"]["Enums"]["message_type"] | null;
          created_at: string;
          deleted_at: string | null;
          id: string;
          is_edited: boolean;
          seen: string | null;
          sender_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          chat_id?: string | null;
          content: string;
          content_type?: Database["public"]["Enums"]["message_type"] | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_edited: boolean;
          seen?: string | null;
          sender_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          chat_id?: string | null;
          content?: string;
          content_type?: Database["public"]["Enums"]["message_type"] | null;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_edited?: boolean;
          seen?: string | null;
          sender_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          image: string | null;
          title: string;
          url: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          image?: string | null;
          title?: string;
          url?: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          image?: string | null;
          title?: string;
          url?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          display_name: string | null;
          email: string | null;
          fcm_token: string | null;
          full_name: string | null;
          id: string;
          type: Database["public"]["Enums"]["profile_type"];
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          display_name?: string | null;
          email?: string | null;
          fcm_token?: string | null;
          full_name?: string | null;
          id: string;
          type?: Database["public"]["Enums"]["profile_type"];
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          display_name?: string | null;
          email?: string | null;
          fcm_token?: string | null;
          full_name?: string | null;
          id?: string;
          type?: Database["public"]["Enums"]["profile_type"];
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      properties: {
        Row: {
          address: string;
          amenities: Json[] | null;
          bathrooms: number;
          bedrooms: number;
          city: string;
          community: string;
          country: string;
          created_at: string;
          date_available: string;
          deposit: number | null;
          description: string;
          furnished: boolean | null;
          id: number;
          images: Json[];
          latitude: number | null;
          lease_duration: string | null;
          listing_type: Database["public"]["Enums"]["listing_type"];
          longitude: number | null;
          lot_size: number | null;
          map_address: string;
          negotiable: boolean;
          price: number;
          property_size: number | null;
          property_type: string;
          reference_code: string;
          status: Database["public"]["Enums"]["property_status"];
          updated_at: string | null;
          user_id: string;
          video_tour: string | null;
        };
        Insert: {
          address?: string;
          amenities?: Json[] | null;
          bathrooms?: number;
          bedrooms?: number;
          city: string;
          community: string;
          country?: string;
          created_at?: string;
          date_available: string;
          deposit?: number | null;
          description: string;
          furnished?: boolean | null;
          id?: number;
          images: Json[];
          latitude?: number | null;
          lease_duration?: string | null;
          listing_type: Database["public"]["Enums"]["listing_type"];
          longitude?: number | null;
          lot_size?: number | null;
          map_address?: string;
          negotiable?: boolean;
          price: number;
          property_size?: number | null;
          property_type: string;
          reference_code: string;
          status: Database["public"]["Enums"]["property_status"];
          updated_at?: string | null;
          user_id: string;
          video_tour?: string | null;
        };
        Update: {
          address?: string;
          amenities?: Json[] | null;
          bathrooms?: number;
          bedrooms?: number;
          city?: string;
          community?: string;
          country?: string;
          created_at?: string;
          date_available?: string;
          deposit?: number | null;
          description?: string;
          furnished?: boolean | null;
          id?: number;
          images?: Json[];
          latitude?: number | null;
          lease_duration?: string | null;
          listing_type?: Database["public"]["Enums"]["listing_type"];
          longitude?: number | null;
          lot_size?: number | null;
          map_address?: string;
          negotiable?: boolean;
          price?: number;
          property_size?: number | null;
          property_type?: string;
          reference_code?: string;
          status?: Database["public"]["Enums"]["property_status"];
          updated_at?: string | null;
          user_id?: string;
          video_tour?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "properties_lease_duration_fkey";
            columns: ["lease_duration"];
            isOneToOne: false;
            referencedRelation: "lease_durations";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "properties_property_type_fkey";
            columns: ["property_type"];
            isOneToOne: false;
            referencedRelation: "property_types";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "properties_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "properties_video_tour_fkey";
            columns: ["video_tour"];
            isOneToOne: false;
            referencedRelation: "videos";
            referencedColumns: ["id"];
          }
        ];
      };
      property_location: {
        Row: {
          city: string | null;
          country: string | null;
          property_id: number;
          state: string | null;
          street_address: string | null;
        };
        Insert: {
          city?: string | null;
          country?: string | null;
          property_id: number;
          state?: string | null;
          street_address?: string | null;
        };
        Update: {
          city?: string | null;
          country?: string | null;
          property_id?: number;
          state?: string | null;
          street_address?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_location_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: true;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
      property_types: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      property_views: {
        Row: {
          id: string;
          property_id: number;
          view_timestamp: string;
          viewer_id: string;
        };
        Insert: {
          id?: string;
          property_id: number;
          view_timestamp?: string;
          viewer_id: string;
        };
        Update: {
          id?: string;
          property_id?: number;
          view_timestamp?: string;
          viewer_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "property_views_viewer_id_fkey";
            columns: ["viewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_chats: {
        Row: {
          blocked: boolean;
          chat_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          blocked?: boolean;
          chat_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          blocked?: boolean;
          chat_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_chats_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_chats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      videos: {
        Row: {
          created_at: string;
          id: string;
          thumbnail_uri: string | null;
          uri: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          thumbnail_uri?: string | null;
          uri?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          thumbnail_uri?: string | null;
          uri?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      property_daily_view_count: {
        Row: {
          daily_view_count: number | null;
          day_start: string | null;
          property_id: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
      property_hourly_view_count: {
        Row: {
          hour_start: string | null;
          hourly_view_count: number | null;
          property_id: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
      property_monthly_view_count: {
        Row: {
          month_start: string | null;
          monthly_view_count: number | null;
          property_id: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
      property_weekly_view_count: {
        Row: {
          property_id: number | null;
          week_start: string | null;
          weekly_view_count: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
      property_yearly_view_count: {
        Row: {
          property_id: number | null;
          year_start: string | null;
          yearly_view_count: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey";
            columns: ["property_id"];
            isOneToOne: false;
            referencedRelation: "properties";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      ddlx_get_dependants: {
        Args: {
          "": unknown;
        };
        Returns: Record<string, unknown>[];
      };
    };
    Enums: {
      listing_type: "rental" | "sale" | "lease";
      message_type:
        | "text"
        | "image"
        | "video"
        | "audio"
        | "location"
        | "document"
        | "file";
      profile_type: "user" | "agent" | "admin" | "agency";
      property_status: "available" | "unavailable";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
