export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abandoned_cart_events: {
        Row: {
          cart_snapshot: Json
          cart_value: number
          created_at: string
          customer_id: string | null
          email_sent_at: string | null
          id: string
          recovered: boolean
          recovered_at: string | null
          recovered_order_id: string | null
          whatsapp_sent_at: string | null
        }
        Insert: {
          cart_snapshot: Json
          cart_value: number
          created_at?: string
          customer_id?: string | null
          email_sent_at?: string | null
          id?: string
          recovered?: boolean
          recovered_at?: string | null
          recovered_order_id?: string | null
          whatsapp_sent_at?: string | null
        }
        Update: {
          cart_snapshot?: Json
          cart_value?: number
          created_at?: string
          customer_id?: string | null
          email_sent_at?: string | null
          id?: string
          recovered?: boolean
          recovered_at?: string | null
          recovered_order_id?: string | null
          whatsapp_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "abandoned_cart_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "abandoned_cart_events_recovered_order_id_fkey"
            columns: ["recovered_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          customer_id: string
          full_name: string
          id: string
          is_default: boolean
          label: string
          line1: string
          line2: string | null
          phone: string
          pincode: string
          state: string
          updated_at: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          customer_id: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string
          line1: string
          line2?: string | null
          phone: string
          pincode: string
          state: string
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          customer_id?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string
          line1?: string
          line2?: string | null
          phone?: string
          pincode?: string
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_generated_images: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          error_message: string | null
          fal_request_id: string | null
          height: number | null
          id: string
          is_approved: boolean
          lora_model: string | null
          product_id: string | null
          promoted_to_product_image_id: string | null
          prompt: string
          public_url: string | null
          status: string
          storage_path: string | null
          width: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          error_message?: string | null
          fal_request_id?: string | null
          height?: number | null
          id?: string
          is_approved?: boolean
          lora_model?: string | null
          product_id?: string | null
          promoted_to_product_image_id?: string | null
          prompt: string
          public_url?: string | null
          status?: string
          storage_path?: string | null
          width?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          error_message?: string | null
          fal_request_id?: string | null
          height?: number | null
          id?: string
          is_approved?: boolean
          lora_model?: string | null
          product_id?: string | null
          promoted_to_product_image_id?: string | null
          prompt?: string
          public_url?: string | null
          status?: string
          storage_path?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_generated_images_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generated_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generated_images_promoted_to_product_image_id_fkey"
            columns: ["promoted_to_product_image_id"]
            isOneToOne: false
            referencedRelation: "product_images"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          customer_id: string
          customizations: Json
          id: string
          product_id: string
          qty: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          customizations?: Json
          id?: string
          product_id: string
          qty?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          customizations?: Json
          id?: string
          product_id?: string
          qty?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          assigned_to: string | null
          channel: string
          closed_at: string | null
          created_at: string
          customer_id: string | null
          id: string
          session_token: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          channel?: string
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          session_token?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          channel?: string
          closed_at?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          session_token?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_sessions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_products: {
        Row: {
          collection_id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          collection_id: string
          product_id: string
          sort_order?: number
        }
        Update: {
          collection_id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          meta_desc: string | null
          meta_title: string | null
          name: string
          occasion: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          meta_desc?: string | null
          meta_title?: string | null
          name: string
          occasion?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          meta_desc?: string | null
          meta_title?: string | null
          name?: string
          occasion?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      coupon_uses: {
        Row: {
          coupon_id: string
          created_at: string
          customer_id: string | null
          discount: number
          id: string
          order_id: string | null
        }
        Insert: {
          coupon_id: string
          created_at?: string
          customer_id?: string | null
          discount: number
          id?: string
          order_id?: string | null
        }
        Update: {
          coupon_id?: string
          created_at?: string
          customer_id?: string | null
          discount?: number
          id?: string
          order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_uses_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_uses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_uses_order_fk"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          is_active: boolean
          max_discount: number | null
          min_order_value: number
          type: string
          updated_at: string
          usage_count: number
          usage_limit: number | null
          valid_from: string
          valid_until: string | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order_value?: number
          type: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          valid_from?: string
          valid_until?: string | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          max_discount?: number | null
          min_order_value?: number
          type?: string
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          valid_from?: string
          valid_until?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segment_members: {
        Row: {
          added_at: string
          customer_id: string
          segment_id: string
        }
        Insert: {
          added_at?: string
          customer_id: string
          segment_id: string
        }
        Update: {
          added_at?: string
          customer_id?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_segment_members_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_segment_members_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "customer_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments: {
        Row: {
          created_at: string
          description: string | null
          filter_rules: Json
          id: string
          is_dynamic: boolean
          last_synced_at: string | null
          member_count: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          filter_rules?: Json
          id?: string
          is_dynamic?: boolean
          last_synced_at?: string | null
          member_count?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          filter_rules?: Json
          id?: string
          is_dynamic?: boolean
          last_synced_at?: string | null
          member_count?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          email: string
          email_opted_in: boolean
          full_name: string | null
          id: string
          last_order_at: string | null
          notes: string | null
          phone: string | null
          tags: string[]
          total_orders: number
          total_spent: number
          updated_at: string
          whatsapp_opted_in: boolean
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          email_opted_in?: boolean
          full_name?: string | null
          id: string
          last_order_at?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[]
          total_orders?: number
          total_spent?: number
          updated_at?: string
          whatsapp_opted_in?: boolean
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          email_opted_in?: boolean
          full_name?: string | null
          id?: string
          last_order_at?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[]
          total_orders?: number
          total_spent?: number
          updated_at?: string
          whatsapp_opted_in?: boolean
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      inventory_alerts: {
        Row: {
          alert_type: string
          created_at: string
          current_qty: number | null
          id: string
          is_resolved: boolean
          notified_admin_at: string | null
          product_id: string
          resolved_at: string | null
          threshold: number | null
          variant_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          current_qty?: number | null
          id?: string
          is_resolved?: boolean
          notified_admin_at?: string | null
          product_id: string
          resolved_at?: string | null
          threshold?: number | null
          variant_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          current_qty?: number | null
          id?: string
          is_resolved?: boolean
          notified_admin_at?: string | null
          product_id?: string
          resolved_at?: string | null
          threshold?: number | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_alerts_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          opened_at: string | null
          order_id: string | null
          provider_msg_id: string | null
          recipient_email: string | null
          recipient_id: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string
          subject: string | null
          template_name: string
        }
        Insert: {
          channel: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          order_id?: string | null
          provider_msg_id?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_name: string
        }
        Update: {
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          order_id?: string | null
          provider_msg_id?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          actor_id: string | null
          actor_type: string | null
          created_at: string
          event_type: string
          from_status: string | null
          id: string
          note: string | null
          order_id: string
          to_status: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_type?: string | null
          created_at?: string
          event_type: string
          from_status?: string | null
          id?: string
          note?: string | null
          order_id: string
          to_status?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_type?: string | null
          created_at?: string
          event_type?: string
          from_status?: string | null
          id?: string
          note?: string | null
          order_id?: string
          to_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_customizations: {
        Row: {
          id: string
          label: string
          order_item_id: string
          value: string
        }
        Insert: {
          id?: string
          label: string
          order_item_id: string
          value: string
        }
        Update: {
          id?: string
          label?: string
          order_item_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_item_customizations_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          order_id: string
          product_id: string | null
          product_name: string
          qty: number
          sku: string | null
          total: number
          unit_price: number
          variant_color: string | null
          variant_id: string | null
          variant_size: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          order_id: string
          product_id?: string | null
          product_name: string
          qty?: number
          sku?: string | null
          total: number
          unit_price: number
          variant_color?: string | null
          variant_id?: string | null
          variant_size?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          order_id?: string
          product_id?: string | null
          product_name?: string
          qty?: number
          sku?: string | null
          total?: number
          unit_price?: number
          variant_color?: string | null
          variant_id?: string | null
          variant_size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_note: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          coupon_code: string | null
          coupon_id: string | null
          created_at: string
          customer_id: string | null
          customer_note: string | null
          delivered_at: string | null
          discount: number
          id: string
          is_cod: boolean
          order_number: string
          payment_method: string
          payment_status: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          shipped_at: string | null
          shipping: number
          shipping_city: string
          shipping_country: string
          shipping_line1: string
          shipping_line2: string | null
          shipping_name: string
          shipping_phone: string
          shipping_pincode: string
          shipping_state: string
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          customer_id?: string | null
          customer_note?: string | null
          delivered_at?: string | null
          discount?: number
          id?: string
          is_cod?: boolean
          order_number: string
          payment_method: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipped_at?: string | null
          shipping?: number
          shipping_city: string
          shipping_country?: string
          shipping_line1: string
          shipping_line2?: string | null
          shipping_name: string
          shipping_phone: string
          shipping_pincode: string
          shipping_state: string
          status?: string
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          customer_id?: string | null
          customer_note?: string | null
          delivered_at?: string | null
          discount?: number
          id?: string
          is_cod?: boolean
          order_number?: string
          payment_method?: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          shipped_at?: string | null
          shipping?: number
          shipping_city?: string
          shipping_country?: string
          shipping_line1?: string
          shipping_line2?: string | null
          shipping_name?: string
          shipping_phone?: string
          shipping_pincode?: string
          shipping_state?: string
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_attempts: {
        Row: {
          amount: number
          created_at: string
          failure_reason: string | null
          gateway: string
          gateway_response: Json | null
          id: string
          order_id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          failure_reason?: string | null
          gateway?: string
          gateway_response?: Json | null
          id?: string
          order_id: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status: string
        }
        Update: {
          amount?: number
          created_at?: string
          failure_reason?: string | null
          gateway?: string
          gateway_response?: Json | null
          id?: string
          order_id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_attempts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_customization_options: {
        Row: {
          choices: string[] | null
          created_at: string
          id: string
          is_required: boolean
          label: string
          max_length: number | null
          product_id: string
          sort_order: number
          type: string
        }
        Insert: {
          choices?: string[] | null
          created_at?: string
          id?: string
          is_required?: boolean
          label: string
          max_length?: number | null
          product_id: string
          sort_order?: number
          type: string
        }
        Update: {
          choices?: string[] | null
          created_at?: string
          id?: string
          is_required?: boolean
          label?: string
          max_length?: number | null
          product_id?: string
          sort_order?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_customization_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          body: string
          created_at: string
          customer_id: string | null
          id: string
          is_published: boolean
          is_verified: boolean
          product_id: string
          rating: number
          reviewer_location: string | null
          reviewer_name: string
        }
        Insert: {
          body: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_published?: boolean
          is_verified?: boolean
          product_id: string
          rating: number
          reviewer_location?: string | null
          reviewer_name: string
        }
        Update: {
          body?: string
          created_at?: string
          customer_id?: string | null
          id?: string
          is_published?: boolean
          is_verified?: boolean
          product_id?: string
          rating?: number
          reviewer_location?: string | null
          reviewer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string | null
          created_at: string
          id: string
          is_active: boolean
          price_delta: number
          product_id: string
          size: string
          sku: string | null
          stock_count: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          price_delta?: number
          product_id: string
          size: string
          sku?: string | null
          stock_count?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          price_delta?: number
          product_id?: string
          size?: string
          sku?: string | null
          stock_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          care_instructions: string | null
          compare_at_price: number | null
          craft_story: string | null
          created_at: string
          customizable: boolean
          deleted_at: string | null
          description: string | null
          fabric: string | null
          id: string
          in_stock: boolean
          is_active: boolean
          is_bestseller: boolean
          is_new: boolean
          meta_desc: string | null
          meta_title: string | null
          name: string
          occasions: string[]
          price: number
          slug: string
          stock_count: number
          tags: string[]
          updated_at: string
        }
        Insert: {
          care_instructions?: string | null
          compare_at_price?: number | null
          craft_story?: string | null
          created_at?: string
          customizable?: boolean
          deleted_at?: string | null
          description?: string | null
          fabric?: string | null
          id?: string
          in_stock?: boolean
          is_active?: boolean
          is_bestseller?: boolean
          is_new?: boolean
          meta_desc?: string | null
          meta_title?: string | null
          name: string
          occasions?: string[]
          price: number
          slug: string
          stock_count?: number
          tags?: string[]
          updated_at?: string
        }
        Update: {
          care_instructions?: string | null
          compare_at_price?: number | null
          craft_story?: string | null
          created_at?: string
          customizable?: boolean
          deleted_at?: string | null
          description?: string | null
          fabric?: string | null
          id?: string
          in_stock?: boolean
          is_active?: boolean
          is_bestseller?: boolean
          is_new?: boolean
          meta_desc?: string | null
          meta_title?: string | null
          name?: string
          occasions?: string[]
          price?: number
          slug?: string
          stock_count?: number
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      return_items: {
        Row: {
          condition: string | null
          id: string
          order_item_id: string
          qty: number
          reason: string | null
          return_request_id: string
        }
        Insert: {
          condition?: string | null
          id?: string
          order_item_id: string
          qty?: number
          reason?: string | null
          return_request_id: string
        }
        Update: {
          condition?: string | null
          id?: string
          order_item_id?: string
          qty?: number
          reason?: string | null
          return_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_return_request_id_fkey"
            columns: ["return_request_id"]
            isOneToOne: false
            referencedRelation: "return_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      return_requests: {
        Row: {
          admin_note: string | null
          created_at: string
          customer_id: string | null
          id: string
          order_id: string
          reason: string
          refund_amount: number | null
          refund_mode: string | null
          resolved_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          order_id: string
          reason: string
          refund_amount?: number | null
          refund_mode?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          order_id?: string
          reason?: string
          refund_amount?: number | null
          refund_mode?: string | null
          resolved_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          courier: string
          created_at: string
          delivered_at: string | null
          estimated_at: string | null
          id: string
          notes: string | null
          order_id: string
          status: string
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          courier: string
          created_at?: string
          delivered_at?: string | null
          estimated_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          courier?: string
          created_at?: string
          delivered_at?: string | null
          estimated_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          ai_prompt: string | null
          caption: string
          created_at: string
          created_by: string | null
          hashtags: string[]
          id: string
          image_urls: string[]
          likes_count: number | null
          platform: string
          product_id: string | null
          published_at: string | null
          reach_count: number | null
          scheduled_for: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ai_prompt?: string | null
          caption: string
          created_at?: string
          created_by?: string | null
          hashtags?: string[]
          id?: string
          image_urls?: string[]
          likes_count?: number | null
          platform: string
          product_id?: string | null
          published_at?: string | null
          reach_count?: number | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ai_prompt?: string | null
          caption?: string
          created_at?: string
          created_by?: string | null
          hashtags?: string[]
          id?: string
          image_urls?: string[]
          likes_count?: number | null
          platform?: string
          product_id?: string | null
          published_at?: string | null
          reach_count?: number | null
          scheduled_for?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_announcements: {
        Row: {
          bg_color: string
          created_at: string
          id: string
          is_active: boolean
          link_text: string | null
          link_url: string | null
          message: string
          show_from: string
          show_until: string | null
          sort_order: number
          text_color: string
          updated_at: string
        }
        Insert: {
          bg_color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          message: string
          show_from?: string
          show_until?: string | null
          sort_order?: number
          text_color?: string
          updated_at?: string
        }
        Update: {
          bg_color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          message?: string
          show_from?: string
          show_until?: string | null
          sort_order?: number
          text_color?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          cod_enabled: boolean
          cod_max_order_value: number
          facebook_url: string | null
          flat_shipping_rate: number
          free_shipping_above: number
          gst_included_in_price: boolean
          gst_number: string | null
          gst_rate_percent: number
          id: number
          instagram_handle: string | null
          maintenance_message: string | null
          maintenance_mode: boolean
          meta_desc: string | null
          meta_title: string | null
          og_image: string | null
          razorpay_key_id: string | null
          store_email: string
          store_name: string
          store_phone: string | null
          support_whatsapp: string | null
          updated_at: string
        }
        Insert: {
          cod_enabled?: boolean
          cod_max_order_value?: number
          facebook_url?: string | null
          flat_shipping_rate?: number
          free_shipping_above?: number
          gst_included_in_price?: boolean
          gst_number?: string | null
          gst_rate_percent?: number
          id?: number
          instagram_handle?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          meta_desc?: string | null
          meta_title?: string | null
          og_image?: string | null
          razorpay_key_id?: string | null
          store_email?: string
          store_name?: string
          store_phone?: string | null
          support_whatsapp?: string | null
          updated_at?: string
        }
        Update: {
          cod_enabled?: boolean
          cod_max_order_value?: number
          facebook_url?: string | null
          flat_shipping_rate?: number
          free_shipping_above?: number
          gst_included_in_price?: boolean
          gst_number?: string | null
          gst_rate_percent?: number
          id?: number
          instagram_handle?: string | null
          maintenance_message?: string | null
          maintenance_mode?: boolean
          meta_desc?: string | null
          meta_title?: string | null
          og_image?: string | null
          razorpay_key_id?: string | null
          store_email?: string
          store_name?: string
          store_phone?: string | null
          support_whatsapp?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_logs: {
        Row: {
          created_at: string
          customer_id: string | null
          error_message: string | null
          gateway_msg_id: string | null
          id: string
          message_type: string
          payload: Json | null
          phone: string
          sent_at: string | null
          status: string
          template_name: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          gateway_msg_id?: string | null
          id?: string
          message_type: string
          payload?: Json | null
          phone: string
          sent_at?: string | null
          status?: string
          template_name?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          gateway_msg_id?: string | null
          id?: string
          message_type?: string
          payload?: Json | null
          phone?: string
          sent_at?: string | null
          status?: string
          template_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_updated_at_trigger: {
        Args: { target_table: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
