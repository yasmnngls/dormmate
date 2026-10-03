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
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
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
      audit_event: {
        Row: {
          action: string;
          actor_id: string | null;
          at: string;
          id: number;
          payload: NonNullable<Json>;
          target: string | null;
          workspace_id: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          at?: string;
          id?: never;
          payload?: NonNullable<Json>;
          target?: string | null;
          workspace_id: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          at?: string;
          id?: never;
          payload?: NonNullable<Json>;
          target?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_event_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      bed: {
        Row: {
          created_at: string;
          id: string;
          label: string;
          room_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label: string;
          room_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string;
          room_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bed_workspace_id_room_id_fkey";
            columns: ["workspace_id", "room_id"];
            isOneToOne: false;
            referencedRelation: "room";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      block: {
        Row: {
          blocked_id: string;
          blocker_id: string;
          created_at: string;
          workspace_id: string;
        };
        Insert: {
          blocked_id: string;
          blocker_id: string;
          created_at?: string;
          workspace_id: string;
        };
        Update: {
          blocked_id?: string;
          blocker_id?: string;
          created_at?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "block_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      building: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          property_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          property_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          property_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "building_workspace_id_property_id_fkey";
            columns: ["workspace_id", "property_id"];
            isOneToOne: false;
            referencedRelation: "property";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      chat_thread: {
        Row: {
          created_at: string;
          id: string;
          kind: Database["public"]["Enums"]["chat_thread_kind"];
          room_id: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kind: Database["public"]["Enums"]["chat_thread_kind"];
          room_id?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["chat_thread_kind"];
          room_id?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_thread_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_thread_workspace_id_room_id_fkey";
            columns: ["workspace_id", "room_id"];
            isOneToOne: false;
            referencedRelation: "room";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      cycle: {
        Row: {
          created_at: string;
          deadline: string | null;
          id: string;
          kind: Database["public"]["Enums"]["cycle_kind"];
          name: string;
          questionnaire_version_id: string;
          status: Database["public"]["Enums"]["cycle_status"];
          weights: NonNullable<Json>;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          deadline?: string | null;
          id?: string;
          kind: Database["public"]["Enums"]["cycle_kind"];
          name: string;
          questionnaire_version_id: string;
          status?: Database["public"]["Enums"]["cycle_status"];
          weights?: NonNullable<Json>;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          deadline?: string | null;
          id?: string;
          kind?: Database["public"]["Enums"]["cycle_kind"];
          name?: string;
          questionnaire_version_id?: string;
          status?: Database["public"]["Enums"]["cycle_status"];
          weights?: NonNullable<Json>;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cycle_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cycle_workspace_id_questionnaire_version_id_fkey";
            columns: ["workspace_id", "questionnaire_version_id"];
            isOneToOne: false;
            referencedRelation: "questionnaire_version";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      enrollment: {
        Row: {
          birthdate: string | null;
          consent_version: string | null;
          created_at: string;
          cycle_id: string;
          gender: Database["public"]["Enums"]["gender"] | null;
          guardian_consent_on: string | null;
          id: string;
          on_roster: boolean;
          status: Database["public"]["Enums"]["enrollment_status"];
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          birthdate?: string | null;
          consent_version?: string | null;
          created_at?: string;
          cycle_id: string;
          gender?: Database["public"]["Enums"]["gender"] | null;
          guardian_consent_on?: string | null;
          id?: string;
          on_roster?: boolean;
          status?: Database["public"]["Enums"]["enrollment_status"];
          user_id: string;
          workspace_id: string;
        };
        Update: {
          birthdate?: string | null;
          consent_version?: string | null;
          created_at?: string;
          cycle_id?: string;
          gender?: Database["public"]["Enums"]["gender"] | null;
          guardian_consent_on?: string | null;
          id?: string;
          on_roster?: boolean;
          status?: Database["public"]["Enums"]["enrollment_status"];
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enrollment_workspace_id_cycle_id_fkey";
            columns: ["workspace_id", "cycle_id"];
            isOneToOne: false;
            referencedRelation: "cycle";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      invite: {
        Row: {
          code: string;
          created_at: string;
          cycle_id: string;
          id: string;
          rotated_at: string | null;
          workspace_id: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          cycle_id: string;
          id?: string;
          rotated_at?: string | null;
          workspace_id: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          cycle_id?: string;
          id?: string;
          rotated_at?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invite_workspace_id_cycle_id_fkey";
            columns: ["workspace_id", "cycle_id"];
            isOneToOne: false;
            referencedRelation: "cycle";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      match_run: {
        Row: {
          created_at: string;
          created_by: string | null;
          cycle_id: string;
          engine_version: string;
          id: string;
          inputs_hash: string | null;
          mode: Database["public"]["Enums"]["match_mode"];
          room_id: string | null;
          status: Database["public"]["Enums"]["match_status"];
          step: string | null;
          timings: NonNullable<Json>;
          weights: NonNullable<Json>;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          cycle_id: string;
          engine_version: string;
          id?: string;
          inputs_hash?: string | null;
          mode: Database["public"]["Enums"]["match_mode"];
          room_id?: string | null;
          status?: Database["public"]["Enums"]["match_status"];
          step?: string | null;
          timings?: NonNullable<Json>;
          weights: NonNullable<Json>;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          cycle_id?: string;
          engine_version?: string;
          id?: string;
          inputs_hash?: string | null;
          mode?: Database["public"]["Enums"]["match_mode"];
          room_id?: string | null;
          status?: Database["public"]["Enums"]["match_status"];
          step?: string | null;
          timings?: NonNullable<Json>;
          weights?: NonNullable<Json>;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "match_run_workspace_id_cycle_id_fkey";
            columns: ["workspace_id", "cycle_id"];
            isOneToOne: false;
            referencedRelation: "cycle";
            referencedColumns: ["workspace_id", "id"];
          },
          {
            foreignKeyName: "match_run_workspace_id_room_id_fkey";
            columns: ["workspace_id", "room_id"];
            isOneToOne: false;
            referencedRelation: "room";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      membership: {
        Row: {
          created_at: string;
          role: Database["public"]["Enums"]["membership_role"];
          user_id: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          role: Database["public"]["Enums"]["membership_role"];
          user_id: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          role?: Database["public"]["Enums"]["membership_role"];
          user_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "membership_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      message: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          sender_id: string | null;
          thread_id: string;
          workspace_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          sender_id?: string | null;
          thread_id: string;
          workspace_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          sender_id?: string | null;
          thread_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_workspace_id_thread_id_fkey";
            columns: ["workspace_id", "thread_id"];
            isOneToOne: false;
            referencedRelation: "chat_thread";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      occupancy: {
        Row: {
          bed_id: string;
          created_at: string;
          ended_on: string | null;
          enrollment_id: string;
          id: string;
          started_on: string;
          workspace_id: string;
        };
        Insert: {
          bed_id: string;
          created_at?: string;
          ended_on?: string | null;
          enrollment_id: string;
          id?: string;
          started_on: string;
          workspace_id: string;
        };
        Update: {
          bed_id?: string;
          created_at?: string;
          ended_on?: string | null;
          enrollment_id?: string;
          id?: string;
          started_on?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "occupancy_workspace_id_bed_id_fkey";
            columns: ["workspace_id", "bed_id"];
            isOneToOne: false;
            referencedRelation: "bed";
            referencedColumns: ["workspace_id", "id"];
          },
          {
            foreignKeyName: "occupancy_workspace_id_enrollment_id_fkey";
            columns: ["workspace_id", "enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollment";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      placement: {
        Row: {
          bed_id: string;
          created_at: string;
          enrollment_id: string;
          id: string;
          locked: boolean;
          overridden_by: string | null;
          reasons: NonNullable<Json>;
          run_id: string;
          score: number | null;
          workspace_id: string;
        };
        Insert: {
          bed_id: string;
          created_at?: string;
          enrollment_id: string;
          id?: string;
          locked?: boolean;
          overridden_by?: string | null;
          reasons?: NonNullable<Json>;
          run_id: string;
          score?: number | null;
          workspace_id: string;
        };
        Update: {
          bed_id?: string;
          created_at?: string;
          enrollment_id?: string;
          id?: string;
          locked?: boolean;
          overridden_by?: string | null;
          reasons?: NonNullable<Json>;
          run_id?: string;
          score?: number | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "placement_workspace_id_bed_id_fkey";
            columns: ["workspace_id", "bed_id"];
            isOneToOne: false;
            referencedRelation: "bed";
            referencedColumns: ["workspace_id", "id"];
          },
          {
            foreignKeyName: "placement_workspace_id_enrollment_id_fkey";
            columns: ["workspace_id", "enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollment";
            referencedColumns: ["workspace_id", "id"];
          },
          {
            foreignKeyName: "placement_workspace_id_run_id_fkey";
            columns: ["workspace_id", "run_id"];
            isOneToOne: false;
            referencedRelation: "match_run";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      profile_version: {
        Row: {
          answers: NonNullable<Json>;
          created_at: string;
          deal_breakers: Database["public"]["Enums"]["habit_category"][];
          enrollment_id: string;
          id: string;
          importance: NonNullable<Json>;
          workspace_id: string;
        };
        Insert: {
          answers: NonNullable<Json>;
          created_at?: string;
          deal_breakers?: Database["public"]["Enums"]["habit_category"][];
          enrollment_id: string;
          id?: string;
          importance?: NonNullable<Json>;
          workspace_id: string;
        };
        Update: {
          answers?: NonNullable<Json>;
          created_at?: string;
          deal_breakers?: Database["public"]["Enums"]["habit_category"][];
          enrollment_id?: string;
          id?: string;
          importance?: NonNullable<Json>;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_version_workspace_id_enrollment_id_fkey";
            columns: ["workspace_id", "enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollment";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      property: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "property_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      push_subscription: {
        Row: {
          created_at: string;
          endpoint: string;
          id: string;
          keys: NonNullable<Json>;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          endpoint: string;
          id?: string;
          keys: NonNullable<Json>;
          user_id: string;
        };
        Update: {
          created_at?: string;
          endpoint?: string;
          id?: string;
          keys?: NonNullable<Json>;
          user_id?: string;
        };
        Relationships: [];
      };
      questionnaire_version: {
        Row: {
          created_at: string;
          id: string;
          questions: NonNullable<Json>;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          questions?: NonNullable<Json>;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          questions?: NonNullable<Json>;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "questionnaire_version_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspace";
            referencedColumns: ["id"];
          },
        ];
      };
      report: {
        Row: {
          assignee_id: string | null;
          created_at: string;
          id: string;
          message_id: string;
          reason: string;
          reporter_id: string | null;
          resolution_note: string | null;
          resolved_at: string | null;
          status: Database["public"]["Enums"]["report_status"];
          workspace_id: string;
        };
        Insert: {
          assignee_id?: string | null;
          created_at?: string;
          id?: string;
          message_id: string;
          reason: string;
          reporter_id?: string | null;
          resolution_note?: string | null;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
          workspace_id: string;
        };
        Update: {
          assignee_id?: string | null;
          created_at?: string;
          id?: string;
          message_id?: string;
          reason?: string;
          reporter_id?: string | null;
          resolution_note?: string | null;
          resolved_at?: string | null;
          status?: Database["public"]["Enums"]["report_status"];
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_workspace_id_message_id_fkey";
            columns: ["workspace_id", "message_id"];
            isOneToOne: false;
            referencedRelation: "message";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      room: {
        Row: {
          building_id: string | null;
          capacity: number;
          created_at: string;
          gender_policy: Database["public"]["Enums"]["gender_policy"];
          id: string;
          label: string;
          property_id: string;
          workspace_id: string;
        };
        Insert: {
          building_id?: string | null;
          capacity: number;
          created_at?: string;
          gender_policy: Database["public"]["Enums"]["gender_policy"];
          id?: string;
          label: string;
          property_id: string;
          workspace_id: string;
        };
        Update: {
          building_id?: string | null;
          capacity?: number;
          created_at?: string;
          gender_policy?: Database["public"]["Enums"]["gender_policy"];
          id?: string;
          label?: string;
          property_id?: string;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "room_property_id_building_id_fkey";
            columns: ["property_id", "building_id"];
            isOneToOne: false;
            referencedRelation: "building";
            referencedColumns: ["property_id", "id"];
          },
          {
            foreignKeyName: "room_workspace_id_property_id_fkey";
            columns: ["workspace_id", "property_id"];
            isOneToOne: false;
            referencedRelation: "property";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      roommate_request: {
        Row: {
          created_at: string;
          cycle_id: string;
          from_enrollment: string;
          id: string;
          to_email: string;
          to_enrollment: string | null;
          workspace_id: string;
        };
        Insert: {
          created_at?: string;
          cycle_id: string;
          from_enrollment: string;
          id?: string;
          to_email: string;
          to_enrollment?: string | null;
          workspace_id: string;
        };
        Update: {
          created_at?: string;
          cycle_id?: string;
          from_enrollment?: string;
          id?: string;
          to_email?: string;
          to_enrollment?: string | null;
          workspace_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "roommate_request_cycle_id_from_enrollment_fkey";
            columns: ["cycle_id", "from_enrollment"];
            isOneToOne: false;
            referencedRelation: "enrollment";
            referencedColumns: ["cycle_id", "id"];
          },
          {
            foreignKeyName: "roommate_request_cycle_id_to_enrollment_fkey";
            columns: ["cycle_id", "to_enrollment"];
            isOneToOne: false;
            referencedRelation: "enrollment";
            referencedColumns: ["cycle_id", "id"];
          },
          {
            foreignKeyName: "roommate_request_workspace_id_cycle_id_fkey";
            columns: ["workspace_id", "cycle_id"];
            isOneToOne: false;
            referencedRelation: "cycle";
            referencedColumns: ["workspace_id", "id"];
          },
        ];
      };
      workspace: {
        Row: {
          created_at: string;
          first_published_at: string | null;
          id: string;
          logo_path: string | null;
          name: string;
          tier: Database["public"]["Enums"]["workspace_tier"];
          trial_ends_at: string;
          trial_started_at: string;
        };
        Insert: {
          created_at?: string;
          first_published_at?: string | null;
          id?: string;
          logo_path?: string | null;
          name: string;
          tier?: Database["public"]["Enums"]["workspace_tier"];
          trial_ends_at?: string;
          trial_started_at?: string;
        };
        Update: {
          created_at?: string;
          first_published_at?: string | null;
          id?: string;
          logo_path?: string | null;
          name?: string;
          tier?: Database["public"]["Enums"]["workspace_tier"];
          trial_ends_at?: string;
          trial_started_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      chat_thread_kind: "room" | "request_group";
      cycle_kind: "term" | "rolling";
      cycle_status: "draft" | "open" | "closed" | "published";
      enrollment_status:
        | "pending"
        | "approved"
        | "rejected"
        | "placed"
        | "moved_out";
      gender: "female" | "male" | "undisclosed";
      gender_policy: "female" | "male" | "any";
      habit_category:
        | "sleep"
        | "wake"
        | "cleanliness"
        | "noise"
        | "guests"
        | "study"
        | "schedule"
        | "smoking"
        | "social"
        | "location";
      match_mode: "batch" | "open_bed";
      match_status: "queued" | "running" | "ready" | "published" | "failed";
      membership_role: "staff" | "manager" | "owner";
      report_status: "open" | "escalated" | "resolved";
      workspace_tier: "trial" | "standard" | "campus" | "enterprise";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      chat_thread_kind: ["room", "request_group"],
      cycle_kind: ["term", "rolling"],
      cycle_status: ["draft", "open", "closed", "published"],
      enrollment_status: [
        "pending",
        "approved",
        "rejected",
        "placed",
        "moved_out",
      ],
      gender: ["female", "male", "undisclosed"],
      gender_policy: ["female", "male", "any"],
      habit_category: [
        "sleep",
        "wake",
        "cleanliness",
        "noise",
        "guests",
        "study",
        "schedule",
        "smoking",
        "social",
        "location",
      ],
      match_mode: ["batch", "open_bed"],
      match_status: ["queued", "running", "ready", "published", "failed"],
      membership_role: ["staff", "manager", "owner"],
      report_status: ["open", "escalated", "resolved"],
      workspace_tier: ["trial", "standard", "campus", "enterprise"],
    },
  },
} as const;
