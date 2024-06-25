import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { corsHeaders, handleOptionsRequest } from '../_shared/cors';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query, req, res) => {
    if (handleOptionsRequest(req, res)) return;
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    res.writeHead(200, corsHeaders);
    return data;
};

/* supabase integration types

### groups

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| group_id   | uuid        | string | false    |
| group_name | varchar(100)| string | true     |
| description| text        | string | false    |
| created_at | timestamptz | string | false    |
| updated_at | timestamptz | string | false    |

### tasks

| name       | type        | format | required |
|------------|-------------|--------|----------|
| task_id    | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| title      | varchar(255)| string | true     |
| description| text        | string | false    |
| category_id| uuid        | string | false    |
| priority   | varchar(50) | string | false    |
| status     | varchar(50) | string | false    |
| due_date   | timestamp   | string | false    |
| created_at | timestamp   | string | false    |
| updated_at | timestamp   | string | false    |

### profiles

| name       | type        | format | required |
|------------|-------------|--------|----------|
| profile_id | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| bio        | text        | string | false    |
| avatar_url | varchar(255)| string | false    |
| created_at | timestamp   | string | false    |
| updated_at | timestamp   | string | false    |

### task_tags

| name       | type        | format | required |
|------------|-------------|--------|----------|
| task_id    | uuid        | string | true     |
| tag_id     | uuid        | string | true     |

### files

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| file_id    | uuid        | string | false    |
| uploader_id| uuid        | string | true     |
| file_name  | text        | string | true     |
| file_type  | text        | string | false    |
| file_size  | int8        | number | false    |
| upload_date| timestamptz | string | false    |
| version    | int4        | number | false    |
| is_active  | bool        | boolean| false    |
| group_id   | uuid        | string | false    |

### comments

| name       | type        | format | required |
|------------|-------------|--------|----------|
| comment_id | uuid        | string | true     |
| task_id    | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| content    | text        | string | true     |
| created_at | timestamp   | string | false    |

### tags

| name       | type        | format | required |
|------------|-------------|--------|----------|
| tag_id     | uuid        | string | true     |
| name       | varchar(50) | string | true     |

### users

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| user_id    | uuid        | string | false    |
| username   | varchar(100)| string | true     |
| group_id   | uuid        | string | false    |
| created_at | timestamptz | string | false    |
| updated_at | timestamptz | string | false    |
| email      | varchar(100)| string | true     |
| password_hash| varchar(255)| string | true     |
| first_name | varchar(50) | string | false    |
| last_name  | varchar(50) | string | false    |

### sessions

| name       | type        | format | required |
|------------|-------------|--------|----------|
| session_id | uuid        | string | true     |
| user_id    | uuid        | string | true     |
| token      | varchar(255)| string | true     |
| created_at | timestamp   | string | false    |
| expires_at | timestamp   | string | false    |

### categories

| name       | type        | format | required |
|------------|-------------|--------|----------|
| category_id| uuid        | string | true     |
| name       | varchar(50) | string | true     |

*/

export const useGroups = () => useQuery({
    queryKey: ['groups'],
    queryFn: (context) => fromSupabase(supabase.from('groups').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newGroup, req, res) => fromSupabase(supabase.from('groups').insert([newGroup]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
        },
    });
};

export const useTasks = () => useQuery({
    queryKey: ['tasks'],
    queryFn: (context) => fromSupabase(supabase.from('tasks').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTask, req, res) => fromSupabase(supabase.from('tasks').insert([newTask]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('tasks');
        },
    });
};

export const useProfiles = () => useQuery({
    queryKey: ['profiles'],
    queryFn: (context) => fromSupabase(supabase.from('profiles').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfile, req, res) => fromSupabase(supabase.from('profiles').insert([newProfile]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('profiles');
        },
    });
};

export const useTaskTags = () => useQuery({
    queryKey: ['task_tags'],
    queryFn: (context) => fromSupabase(supabase.from('task_tags').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddTaskTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTaskTag, req, res) => fromSupabase(supabase.from('task_tags').insert([newTaskTag]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('task_tags');
        },
    });
};

export const useFiles = () => useQuery({
    queryKey: ['files'],
    queryFn: (context) => fromSupabase(supabase.from('files').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newFile, req, res) => fromSupabase(supabase.from('files').insert([newFile]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('files');
        },
    });
};

export const useComments = () => useQuery({
    queryKey: ['comments'],
    queryFn: (context) => fromSupabase(supabase.from('comments').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newComment, req, res) => fromSupabase(supabase.from('comments').insert([newComment]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('comments');
        },
    });
};

export const useTags = () => useQuery({
    queryKey: ['tags'],
    queryFn: (context) => fromSupabase(supabase.from('tags').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddTag = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newTag, req, res) => fromSupabase(supabase.from('tags').insert([newTag]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('tags');
        },
    });
};

export const useUsers = () => useQuery({
    queryKey: ['users'],
    queryFn: (context) => fromSupabase(supabase.from('users').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newUser, req, res) => fromSupabase(supabase.from('users').insert([newUser]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
};

export const useSessions = () => useQuery({
    queryKey: ['sessions'],
    queryFn: (context) => fromSupabase(supabase.from('sessions').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddSession = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSession, req, res) => fromSupabase(supabase.from('sessions').insert([newSession]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('sessions');
        },
    });
};

export const useCategories = () => useQuery({
    queryKey: ['categories'],
    queryFn: (context) => fromSupabase(supabase.from('categories').select('*'), context.queryKey[1], context.queryKey[2]),
});

export const useAddCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newCategory, req, res) => fromSupabase(supabase.from('categories').insert([newCategory]), req, res),
        onSuccess: () => {
            queryClient.invalidateQueries('categories');
        },
    });
};

// New function to upload PNG files to Supabase bucket
export const uploadPngToBucket = async (file) => {
    const { data, error } = await supabase.storage
        .from('files_bucket')
        .upload(`public/${file.name}`, file);

    if (error) throw new Error(error.message);
    return data;
};